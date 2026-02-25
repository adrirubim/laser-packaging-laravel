<?php

namespace App\Http\Controllers;

use App\Models\CriticalIssue;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CriticalIssueController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of critical issues.
     */
    public function index(Request $request): Response
    {
        $query = CriticalIssue::active();

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $criticalIssues = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('CriticalIssues/Index', [
            'criticalIssues' => $criticalIssues,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new critical issue.
     */
    public function create(): Response
    {
        return Inertia::render('CriticalIssues/Create');
    }

    /**
     * Store a newly created critical issue.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $criticalIssue = CriticalIssue::create($validated);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('critical-issues.index')
            ->with('success', __('flash.critical_issue.created'));
    }

    /**
     * Display the specified critical issue.
     */
    public function show(CriticalIssue $criticalIssue): Response
    {
        $criticalIssue->load('articles');

        return Inertia::render('CriticalIssues/Show', [
            'criticalIssue' => $criticalIssue,
        ]);
    }

    /**
     * Show the form for editing the specified critical issue.
     */
    public function edit(CriticalIssue $criticalIssue): Response
    {
        return Inertia::render('CriticalIssues/Edit', [
            'criticalIssue' => $criticalIssue,
        ]);
    }

    /**
     * Update the specified critical issue.
     */
    public function update(Request $request, CriticalIssue $criticalIssue)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $criticalIssue->update($validated);

        return redirect()->route('critical-issues.index')
            ->with('success', __('flash.critical_issue.updated'));
    }

    /**
     * Remove the specified critical issue (soft delete).
     */
    public function destroy(CriticalIssue $criticalIssue)
    {
        $criticalIssue->removed = true;
        $criticalIssue->save();

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('critical-issues.index')
            ->with('success', __('flash.critical_issue.deleted'));
    }
}
