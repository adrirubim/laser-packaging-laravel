<?php

namespace Tests\Feature\Controllers;

use App\Models\LasWorkLine;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LasWorkLineControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_work_lines()
    {
        $this->actingAs($this->user);

        LasWorkLine::factory()->create(['removed' => false, 'name' => 'Linea Test 1']);
        LasWorkLine::factory()->create(['removed' => false, 'name' => 'Linea Test 2']);

        $response = $this->get(route('las-work-lines.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('workLines')->has('workLines.data'));
    }

    #[Test]
    public function it_stores_new_work_line()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-work-lines.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LWL-001',
            'name' => 'Nuova Linea di Lavoro',
        ]);

        $response->assertRedirect(route('las-work-lines.index'));
        $response->assertSessionHas('success', 'Linea di Lavoro LAS creata con successo.');
        $this->assertDatabaseHas('offerlasworkline', ['code' => 'LWL-001', 'name' => 'Nuova Linea di Lavoro', 'removed' => false]);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('las-work-lines.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasWorkLines/Create'));
    }

    #[Test]
    public function it_shows_work_line_details()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create(['name' => 'Linea Test', 'code' => 'LWL-001']);

        $response = $this->get(route('las-work-lines.show', $workLine));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasWorkLines/Show')
            ->has('workLine')
            ->where('workLine.name', 'Linea Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create(['name' => 'Linea Test', 'code' => 'LWL-001']);

        $response = $this->get(route('las-work-lines.edit', $workLine));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasWorkLines/Edit')
            ->has('workLine')
            ->where('workLine.name', 'Linea Test')
        );
    }

    #[Test]
    public function it_updates_work_line()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create(['code' => 'LWL-001', 'name' => 'Linea Originale']);

        $response = $this->put(route('las-work-lines.update', $workLine), [
            'code' => 'LWL-002',
            'name' => 'Linea Aggiornata',
        ]);

        $response->assertRedirect(route('las-work-lines.index'));
        $this->assertDatabaseHas('offerlasworkline', ['id' => $workLine->id, 'name' => 'Linea Aggiornata']);
    }

    #[Test]
    public function it_soft_deletes_work_line()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create(['removed' => false]);

        $response = $this->delete(route('las-work-lines.destroy', $workLine));

        $response->assertRedirect(route('las-work-lines.index'));
        $workLine->refresh();
        $this->assertTrue($workLine->removed);
    }

    #[Test]
    public function it_filters_work_lines_by_search()
    {
        $this->actingAs($this->user);

        LasWorkLine::factory()->create(['removed' => false, 'code' => 'LWL-001', 'name' => 'Linea Alpha']);
        LasWorkLine::factory()->create(['removed' => false, 'code' => 'LWL-002', 'name' => 'Linea Beta']);

        $response = $this->get(route('las-work-lines.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('workLines.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Linea Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_work_lines()
    {
        $this->actingAs($this->user);

        LasWorkLine::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('las-work-lines.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('workLines')
            ->where('workLines.current_page', 1)
            ->where('workLines.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        LasWorkLine::factory()->create(['removed' => false, 'code' => 'LWL-001', 'name' => 'Linea Test']);

        $response = $this->get(route('las-work-lines.index', ['search' => 'NonExistent']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('workLines.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-work-lines.store'), []);

        $response->assertSessionHasErrors(['uuid', 'code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-work-lines.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => str_repeat('a', 256),
            'name' => 'Test Work Line',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-work-lines.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LWL-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create();

        $response = $this->put(route('las-work-lines.update', $workLine), []);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create();

        $response = $this->put(route('las-work-lines.update', $workLine), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Work Line',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $workLine = LasWorkLine::factory()->create();

        $response = $this->put(route('las-work-lines.update', $workLine), [
            'code' => 'LWL-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_work_lines()
    {
        $this->actingAs($this->user);

        LasWorkLine::factory()->create(['removed' => false, 'code' => 'LWL-001', 'name' => 'Linea Attiva']);
        LasWorkLine::factory()->create(['removed' => true, 'code' => 'LWL-002', 'name' => 'Linea Eliminata']);

        $response = $this->get(route('las-work-lines.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('workLines.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Linea Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
