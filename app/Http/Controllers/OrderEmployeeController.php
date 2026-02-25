<?php

namespace App\Http\Controllers;

use App\Actions\SyncOrderEmployeesAction;
use App\Models\Employee;
use App\Models\OfferOrderEmployee;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderEmployeeController extends Controller
{
    protected SyncOrderEmployeesAction $syncOrderEmployeesAction;

    public function __construct(SyncOrderEmployeesAction $syncOrderEmployeesAction)
    {
        $this->syncOrderEmployeesAction = $syncOrderEmployeesAction;
    }

    /**
     * Display a listing of order employee assignments.
     */
    public function index(Request $request): Response
    {
        $query = OfferOrderEmployee::active()->with(['order', 'employee']);

        if ($request->has('order_uuid')) {
            $query->where('order_uuid', $request->get('order_uuid'));
        }

        if ($request->has('employee_uuid')) {
            $query->where('employee_uuid', $request->get('employee_uuid'));
        }

        $assignments = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('OrderEmployees/Index', [
            'assignments' => $assignments,
            'filters' => $request->only(['order_uuid', 'employee_uuid']),
        ]);
    }

    /**
     * Get employee assignments for a specific order (API endpoint).
     */
    public function getEmployeeAssignments(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|uuid|exists:orderorder,uuid',
        ]);

        $assignments = OfferOrderEmployee::where('order_uuid', $request->order_uuid)
            ->where('removed', false)
            ->pluck('employee_uuid')
            ->toArray();

        return response()->json(['assignments' => $assignments]);
    }

    /**
     * Save employee assignments for a specific order (API endpoint).
     */
    public function saveEmployeeAssignments(Request $request)
    {
        $validated = $request->validate([
            'order_uuid' => 'required|uuid|exists:orderorder,uuid',
            'employee_list' => 'required|array',
            'employee_list.*' => 'uuid|exists:employee,uuid',
        ]);

        $this->syncOrderEmployeesAction->execute(
            $validated['order_uuid'],
            $validated['employee_list']
        );

        // Return Inertia-compatible redirect instead of JSON
        return redirect()->route('orders.show', $validated['order_uuid'])
            ->with('success', __('flash.order_employee.saved'));
    }

    /**
     * Check if an employee is assigned to an order.
     */
    public function checkEmployeeOrder(Request $request)
    {
        $validated = $request->validate([
            'employee_uuid' => 'required|uuid|exists:employee,uuid',
            'order_uuid' => 'required|uuid|exists:orderorder,uuid',
        ]);

        $exists = OfferOrderEmployee::where('employee_uuid', $validated['employee_uuid'])
            ->where('order_uuid', $validated['order_uuid'])
            ->where('removed', false)
            ->exists();

        return response()->json(['assigned' => $exists]);
    }

    /**
     * Show the form for managing employee assignments for an order.
     */
    public function manageOrder(Order $order): Response
    {
        $assignedEmployees = OfferOrderEmployee::where('order_uuid', $order->uuid)
            ->where('removed', false)
            ->with('employee')
            ->get()
            ->pluck('employee')
            ->filter();

        $allEmployees = Employee::active()
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'name', 'surname', 'matriculation_number']);

        return Inertia::render('OrderEmployees/ManageOrder', [
            'order' => $order,
            'assignedEmployees' => $assignedEmployees,
            'allEmployees' => $allEmployees,
        ]);
    }

    /**
     * Remove the specified order employee assignment (soft delete).
     */
    public function destroy(OfferOrderEmployee $orderEmployee)
    {
        $orderEmployee->update(['removed' => true]);

        return redirect()->back()
            ->with('success', __('flash.order_employee.deleted'));
    }
}
