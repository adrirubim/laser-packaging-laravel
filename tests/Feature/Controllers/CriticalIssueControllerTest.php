<?php

namespace Tests\Feature\Controllers;

use App\Models\CriticalIssue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CriticalIssueControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_critical_issues()
    {
        $this->actingAs($this->user);

        CriticalIssue::factory()->create([
            'removed' => false,
            'name' => 'Issue 1',
        ]);

        $response = $this->get(route('critical-issues.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('criticalIssues')
            ->has('criticalIssues.data')
        );
    }

    #[Test]
    public function it_filters_critical_issues_by_search()
    {
        $this->actingAs($this->user);

        CriticalIssue::factory()->create(['name' => 'Issue Alpha']);
        CriticalIssue::factory()->create(['name' => 'Issue Beta']);

        $response = $this->get(route('critical-issues.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Alpha')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('critical-issues.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('CriticalIssues/Create')
        );
    }

    #[Test]
    public function it_stores_new_critical_issue()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('critical-issues.store'), [
            'name' => 'New Critical Issue',
        ]);

        $response->assertRedirect(route('critical-issues.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('criticalissues', [
            'name' => 'New Critical Issue',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_shows_critical_issue()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create();

        $response = $this->get(route('critical-issues.show', $criticalIssue));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('CriticalIssues/Show')
            ->has('criticalIssue')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create();

        $response = $this->get(route('critical-issues.edit', $criticalIssue));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('CriticalIssues/Edit')
            ->has('criticalIssue')
        );
    }

    #[Test]
    public function it_updates_critical_issue()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create([
            'name' => 'Old Issue',
        ]);

        $response = $this->put(route('critical-issues.update', $criticalIssue), [
            'name' => 'Updated Issue',
        ]);

        $response->assertRedirect(route('critical-issues.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('criticalissues', [
            'id' => $criticalIssue->id,
            'name' => 'Updated Issue',
        ]);
    }

    #[Test]
    public function it_destroys_critical_issue()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create();

        $response = $this->delete(route('critical-issues.destroy', $criticalIssue));

        $response->assertRedirect(route('critical-issues.index'));
        $response->assertSessionHas('success');

        $criticalIssue->refresh();
        $this->assertTrue($criticalIssue->removed);
    }

    #[Test]
    public function it_requires_name()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('critical-issues.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_name_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('critical-issues.store'), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_critical_issues()
    {
        $this->actingAs($this->user);

        $active = CriticalIssue::factory()->create(['removed' => false, 'name' => 'Active Issue']);
        $removed = CriticalIssue::factory()->create(['removed' => true, 'name' => 'Removed Issue']);

        $response = $this->get(route('critical-issues.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('criticalIssues.data', function ($data) use ($active) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($active->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_critical_issues()
    {
        $this->actingAs($this->user);

        CriticalIssue::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('critical-issues.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('criticalIssues.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('criticalIssues.current_page')
            ->has('criticalIssues.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('critical-issues.index', [
            'search' => 'NonExistentIssue',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('criticalIssues.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(0, $dataArray);

            return true;
        })
        );
    }

    #[Test]
    public function it_loads_articles_in_show()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create();

        $response = $this->get(route('critical-issues.show', $criticalIssue));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('criticalIssue.articles')
        );
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $criticalIssue = CriticalIssue::factory()->create();

        $response = $this->put(route('critical-issues.update', $criticalIssue), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }
}
