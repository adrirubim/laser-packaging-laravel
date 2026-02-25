<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\EmployeeContract;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Picqer\Barcode\BarcodeGeneratorHTML;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request): Response
    {
        $query = Employee::active();

        // Filters
        if ($request->has('portal_enabled')) {
            $portalEnabled = $request->get('portal_enabled');
            if ($portalEnabled === '1' || $portalEnabled === 'true') {
                $query->portalEnabled();
            } elseif ($portalEnabled === '0' || $portalEnabled === 'false') {
                $query->where('portal_enabled', false);
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('matriculation_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(name, ' ', surname) LIKE ?", ["%{$search}%"]);
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'surname');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortColumns = ['id', 'name', 'surname', 'matriculation_number'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('surname', 'asc')->orderBy('name', 'asc');
        }

        $perPage = $request->get('per_page', 10);
        $employees = $query->paginate($perPage);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'portal_enabled', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create(): Response
    {
        return Inertia::render('Employees/Create');
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        // Hash password with SHA512 (as in legacy system)
        $validated['password'] = hash('sha512', $validated['password']);
        $validated['portal_enabled'] = $validated['portal_enabled'] ?? false;

        $employee = Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('success', __('flash.employee.created'));
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): Response
    {
        $employee->load(['contracts', 'portalTokens', 'orderProcessings', 'orders']);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee): Response
    {
        $employee->load(['contracts']);

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $validated = $request->validated();

        // Hash password only if a new one was provided
        if (! empty($validated['password'])) {
            $validated['password'] = hash('sha512', $validated['password']);
        } else {
            unset($validated['password']);
        }

        $employee->update($validated);

        return redirect()->route('employees.index')
            ->with('success', __('flash.employee.updated'));
    }

    /**
     * Remove the specified employee (soft delete).
     */
    public function destroy(Employee $employee)
    {
        // Check that employee has no active order processings
        if ($employee->orderProcessings()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_employee'),
            ]);
        }

        // Soft delete
        $employee->update(['removed' => true]);

        return redirect()->route('employees.index')
            ->with('success', __('flash.employee.deleted'));
    }

    /**
     * Update employee password.
     */
    public function updatePassword(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|string|same:new_password',
        ]);

        // Verify current password
        if (! $employee->verifyPassword($validated['current_password'])) {
            return back()->withErrors([
                'current_password' => __('flash.employee.wrong_password'),
            ]);
        }

        // Update password
        $employee->update([
            'password' => hash('sha512', $validated['new_password']),
        ]);

        return back()->with('success', __('flash.employee.password_updated'));
    }

    /**
     * Toggle portal enabled status.
     */
    public function togglePortal(Request $request, Employee $employee)
    {
        $employee->update([
            'portal_enabled' => ! $employee->portal_enabled,
        ]);

        return response()->json([
            'success' => true,
            'portal_enabled' => $employee->portal_enabled,
        ]);
    }

    /**
     * Display a listing of all employee contracts.
     */
    public function contractsIndex(Request $request): Response
    {
        $query = EmployeeContract::active()
            ->with(['employee', 'supplier']);

        // Validate and apply filters
        $validated = $request->validate([
            'employee_uuid' => 'nullable|uuid',
            'supplier_uuid' => 'nullable|uuid',
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|string|in:start_date,end_date,pay_level,employee,supplier',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        // Filters
        if (! empty($validated['employee_uuid'])) {
            $query->where('employee_uuid', $validated['employee_uuid']);
        }

        if (! empty($validated['supplier_uuid'])) {
            $query->where('supplier_uuid', $validated['supplier_uuid']);
        }

        // Search
        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('matriculation_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $validated['sort_by'] ?? 'start_date';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $allowedSortColumns = ['start_date', 'end_date', 'pay_level'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } elseif ($sortBy === 'employee') {
            // Ordinare per dipendente usando relazione
            $query->join('employee as emp', 'employeecontracts.employee_uuid', '=', 'emp.uuid')
                ->select('employeecontracts.*')
                ->orderBy('emp.surname', $sortOrder)
                ->orderBy('emp.name', $sortOrder);
        } elseif ($sortBy === 'supplier') {
            // Ordinare per fornitore usando relazione
            $query->join('supplier as sup', 'employeecontracts.supplier_uuid', '=', 'sup.uuid')
                ->select('employeecontracts.*')
                ->orderBy('sup.company_name', $sortOrder);
        } else {
            // Default: ordenar por fecha de inicio descendente
            $query->orderBy('start_date', 'desc');
        }

        $perPage = $validated['per_page'] ?? 10;
        $contracts = $query->paginate($perPage);

        $employees = Employee::active()
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'matriculation_number', 'name', 'surname']);

        $suppliers = \App\Models\Supplier::active()
            ->orderBy('company_name')
            ->get(['uuid', 'code', 'company_name']);

        return Inertia::render('Employees/ContractsIndex', [
            'contracts' => $contracts,
            'employees' => $employees,
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $validated['search'] ?? null,
                'employee_uuid' => $validated['employee_uuid'] ?? null,
                'supplier_uuid' => $validated['supplier_uuid'] ?? null,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Get employee contracts.
     */
    public function contracts(Employee $employee)
    {
        $contracts = $employee->contracts()
            ->where('removed', false)
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($contracts);
    }

    /**
     * Show the form for creating a new contract.
     * Query param ?proroga={contract_uuid} precompila il form (flusso Proroga).
     */
    public function createContract(Request $request): Response
    {
        $employees = Employee::active()
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'matriculation_number', 'name', 'surname']);

        $suppliers = \App\Models\Supplier::active()
            ->orderBy('company_name')
            ->get(['uuid', 'code', 'company_name']);

        $prorogaContract = null;
        $prorogaUuid = $request->query('proroga');
        if ($prorogaUuid) {
            $contract = EmployeeContract::active()
                ->with(['employee', 'supplier'])
                ->where('uuid', $prorogaUuid)
                ->first();
            if ($contract) {
                $startDate = $contract->end_date
                    ? $contract->end_date->format('Y-m-d')
                    : now()->format('Y-m-d');
                $prorogaContract = [
                    'employee_uuid' => $contract->employee_uuid,
                    'supplier_uuid' => $contract->supplier_uuid,
                    'pay_level' => (int) $contract->pay_level,
                    'start_date' => $startDate,
                    'employee_name' => $contract->employee
                        ? trim($contract->employee->surname.' '.$contract->employee->name)
                        : '',
                    'supplier_name' => $contract->supplier?->company_name ?? '',
                ];
            }
        }

        return Inertia::render('Employees/Contracts/Create', [
            'employees' => $employees,
            'suppliers' => $suppliers,
            'prorogaContract' => $prorogaContract,
        ]);
    }

    /**
     * Store a new contract (independent route).
     */
    public function storeContract(Request $request)
    {
        $validated = $request->validate([
            'employee_uuid' => 'required|uuid|exists:employee,uuid',
            'supplier_uuid' => 'required|uuid|exists:supplier,uuid',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'pay_level' => 'nullable|integer|in:0,1,2,3,4,5,6,7,8',
        ]);

        $contract = EmployeeContract::create($validated);

        return redirect()->route('employees.contracts.index')
            ->with('success', __('flash.contract.created'));
    }

    /**
     * Show the form for editing a contract.
     */
    public function editContract(EmployeeContract $contract): Response
    {
        $contract->load(['employee', 'supplier']);

        $employees = Employee::active()
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'matriculation_number', 'name', 'surname']);

        $suppliers = \App\Models\Supplier::active()
            ->orderBy('company_name')
            ->get(['uuid', 'code', 'company_name']);

        return Inertia::render('Employees/Contracts/Edit', [
            'contract' => $contract,
            'employees' => $employees,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update a contract (independent route).
     */
    public function updateContract(Request $request, EmployeeContract $contract)
    {
        $validated = $request->validate([
            'employee_uuid' => 'required|uuid|exists:employee,uuid',
            'supplier_uuid' => 'required|uuid|exists:supplier,uuid',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'pay_level' => 'nullable|integer|in:0,1,2,3,4,5,6,7,8',
        ]);

        $contract->update($validated);

        return redirect()->route('employees.contracts.index')
            ->with('success', __('flash.contract.updated'));
    }

    /**
     * Remove a contract (independent route).
     */
    public function destroyContract(EmployeeContract $contract)
    {
        $contract->update(['removed' => true]);

        return redirect()->route('employees.contracts.index')
            ->with('success', __('flash.contract.deleted'));
    }

    /**
     * Store a new contract for the employee (legacy route).
     */
    public function storeContractLegacy(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            // Pay level allowed 0–8 (parity with EmployeeContract and UI)
            'pay_level' => 'nullable|integer|in:0,1,2,3,4,5,6,7,8',
        ]);

        $contract = $employee->contracts()->create($validated);

        return response()->json([
            'success' => true,
            'contract' => $contract,
        ]);
    }

    /**
     * Update an employee contract (legacy route).
     */
    public function updateContractLegacy(Request $request, Employee $employee, EmployeeContract $contract)
    {
        // Verify that contract belongs to employee
        if ($contract->employee_uuid !== $employee->uuid) {
            return response()->json(['error' => __('flash.contract_not_found')], 404);
        }

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            // Pay level allowed 0–8 (parity with EmployeeContract and UI)
            'pay_level' => 'nullable|integer|in:0,1,2,3,4,5,6,7,8',
        ]);

        $contract->update($validated);

        return response()->json([
            'success' => true,
            'contract' => $contract,
        ]);
    }

    /**
     * Remove an employee contract (legacy route).
     */
    public function destroyContractLegacy(Employee $employee, EmployeeContract $contract)
    {
        // Verify that contract belongs to employee
        if ($contract->employee_uuid !== $employee->uuid) {
            return response()->json(['error' => __('flash.contract_not_found')], 404);
        }

        $contract->update(['removed' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Download barcode PDF for employee.
     */
    public function downloadBarcode(Employee $employee)
    {
        // Generate barcode code (pad employee ID to 13 digits)
        $code = str_pad((string) $employee->id, 13, '0', STR_PAD_LEFT);

        // Generate barcode HTML
        $generator = new BarcodeGeneratorHTML;
        $barcodeHtml = $generator->getBarcode($code, $generator::TYPE_CODE_128, 3, 60);

        // Create PDF
        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);

        $html = view('employee.barcode', [
            'barcode' => $barcodeHtml,
            'code' => $code,
            'employee' => $employee,
        ])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $filename = 'barcode_addetto_'.$employee->matriculation_number.'.pdf';

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
