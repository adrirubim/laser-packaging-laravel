<?php

namespace App\Http\Controllers;

use App\Models\ValueTypes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValueTypesController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ValueTypes::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('uuid', 'like', "%{$search}%");
        }

        $valueTypes = $query->orderBy('uuid')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('ValueTypes/Index', [
            'valueTypes' => $valueTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ValueTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'nullable|uuid|unique:valuetypes,uuid',
        ], [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => __('validation.uuid_unique'),
        ]);

        // If UUID is not provided, the HasUuids trait will generate it automatically
        $data = $validated;
        if (empty($data['uuid'])) {
            unset($data['uuid']);
        }

        ValueTypes::create($data);

        return redirect()->route('value-types.index')
            ->with('success', __('flash.value_type.created'));
    }

    public function show(ValueTypes $valueType): Response
    {
        return Inertia::render('ValueTypes/Show', [
            'valueType' => $valueType,
        ]);
    }

    public function edit(ValueTypes $valueType): Response
    {
        return Inertia::render('ValueTypes/Edit', [
            'valueType' => $valueType,
        ]);
    }

    public function update(Request $request, ValueTypes $valueType)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:valuetypes,uuid,'.$valueType->id.',id',
        ], [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => __('validation.uuid_unique'),
        ]);

        $valueType->update($validated);

        return redirect()->route('value-types.index')
            ->with('success', __('flash.value_type.updated'));
    }

    public function destroy(ValueTypes $valueType)
    {
        $valueType->update(['removed' => true]);

        return redirect()->route('value-types.index')
            ->with('success', __('flash.value_type.deleted'));
    }
}
