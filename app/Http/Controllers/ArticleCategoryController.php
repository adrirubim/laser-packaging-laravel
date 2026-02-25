<?php

namespace App\Http\Controllers;

use App\Models\ArticleCategory;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleCategoryController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of article categories.
     */
    public function index(Request $request): Response
    {
        $query = ArticleCategory::active();

        // Ricerca
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSorts = ['name'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('name', 'asc');
        }

        $categories = $query->paginate($request->get('per_page', 15));

        return Inertia::render('ArticleCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new article category.
     */
    public function create(): Response
    {
        return Inertia::render('ArticleCategories/Create');
    }

    /**
     * Store a newly created article category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = ArticleCategory::create($validated);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('article-categories.index')
            ->with('success', __('flash.article_category.created'));
    }

    /**
     * Display the specified article category.
     */
    public function show(ArticleCategory $articleCategory): Response
    {
        $articleCategory->load('articles');

        return Inertia::render('ArticleCategories/Show', [
            'category' => $articleCategory,
        ]);
    }

    /**
     * Show the form for editing the specified article category.
     */
    public function edit(ArticleCategory $articleCategory): Response
    {
        return Inertia::render('ArticleCategories/Edit', [
            'category' => $articleCategory,
        ]);
    }

    /**
     * Update the specified article category.
     */
    public function update(Request $request, ArticleCategory $articleCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $articleCategory->update($validated);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('article-categories.index')
            ->with('success', __('flash.article_category.updated'));
    }

    /**
     * Remove the specified article category (soft delete).
     */
    public function destroy(ArticleCategory $articleCategory)
    {
        $articleCategory->update(['removed' => true]);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('article-categories.index')
            ->with('success', __('flash.article_category.deleted'));
    }
}
