<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\ProductionPortalController;
use App\Models\Employee;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionPortalWebController extends Controller
{
    protected ProductionPortalController $apiController;

    public function __construct(ProductionPortalController $apiController)
    {
        $this->apiController = $apiController;
    }

    /**
     * Show login page
     */
    public function login(): Response
    {
        return Inertia::render('ProductionPortal/Login');
    }

    /**
     * Handle login via API and store token in session
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'matriculation_number' => 'required_without:employee_number|string',
            'password' => 'required_without:employee_number|string',
            'employee_number' => 'required_without:matriculation_number|string',
            'order_number' => 'required_with:employee_number|string',
        ]);

        // If EAN authentication
        if ($request->has('employee_number') && $request->has('order_number')) {
            $apiRequest = new Request([
                'employee_number' => $request->get('employee_number'),
                'order_number' => $request->get('order_number'),
            ]);

            $response = $this->apiController->authenticate($apiRequest);
            $data = json_decode($response->getContent(), true);

            if (! isset($data['ok']) || $data['ok'] !== 1) {
                return back()->withErrors(['error' => $data['error'] ?? __('production_portal.auth_failed')]);
            }

            // Store token and employee data in session
            session([
                'production_portal_token' => $data['employee']['token'],
                'production_portal_employee' => $data['employee'],
                'production_portal_order_uuid' => $data['order_uuid'] ?? null,
            ]);

            // Redirect to order detail if order_uuid is provided
            if (isset($data['order_uuid'])) {
                return redirect()->route('production-portal.order', ['order' => $data['order_uuid']]);
            }

            return redirect()->route('production-portal.dashboard');
        }

        // If login with matriculation_number and password
        $apiRequest = new Request([
            'matriculation_number' => $request->get('matriculation_number'),
            'password' => $request->get('password'),
        ]);

        $response = $this->apiController->login($apiRequest);
        $data = json_decode($response->getContent(), true);

        if (! isset($data['ok']) || $data['ok'] !== 1) {
            return back()->withErrors(['error' => $data['error'] ?? __('production_portal.invalid_credentials')]);
        }

        // Store token and employee data in session
        session([
            'production_portal_token' => $data['employee']['token'],
            'production_portal_employee' => $data['employee'],
        ]);

        return redirect()->route('production-portal.dashboard');
    }

    /**
     * Show dashboard with order list
     */
    public function dashboard(Request $request)
    {
        $token = session('production_portal_token');

        if (! $token) {
            return redirect()->route('production-portal.login');
        }

        // Get order list via API
        $apiRequest = new Request(['token' => $token]);
        $response = $this->apiController->getEmployeeOrderList($apiRequest);
        $data = json_decode($response->getContent(), true);

        if (! isset($data['ok']) || $data['ok'] !== 1) {
            session()->forget(['production_portal_token', 'production_portal_employee']);

            return redirect()->route('production-portal.login')
                ->withErrors(['error' => $data['error'] ?? __('production_portal.session_expired')]);
        }

        return Inertia::render('ProductionPortal/Dashboard', [
            'orders' => $data['order'] ?? [],
            'employee' => session('production_portal_employee'),
            'token' => $token, // Pass token to frontend
        ]);
    }

    /**
     * Show order detail page
     */
    public function showOrder(Request $request, string $orderUuid)
    {
        $token = session('production_portal_token');

        if (! $token) {
            return redirect()->route('production-portal.login');
        }

        // Get order info via API
        $apiRequest = new Request([
            'order_uuid' => $orderUuid,
            'token' => $token,
        ]);

        $response = $this->apiController->getInfo($apiRequest);
        $data = json_decode($response->getContent(), true);

        if (! isset($data['ok']) || $data['ok'] !== 1) {
            return redirect()->route('production-portal.dashboard')
                ->withErrors(['error' => $data['error'] ?? __('production_portal.cannot_load_order')]);
        }

        $employee = session('production_portal_employee');
        $employee['token'] = $token; // Add token to employee data

        return Inertia::render('ProductionPortal/OrderDetail', [
            'order' => $data['order'] ?? null,
            'employee' => $employee,
        ]);
    }

    /**
     * Logout
     */
    public function logout(): \Illuminate\Http\RedirectResponse
    {
        session()->forget([
            'production_portal_token',
            'production_portal_employee',
            'production_portal_order_uuid',
        ]);

        return redirect()->route('production-portal.login')
            ->with('success', __('flash.production_portal.session_closed'));
    }
}
