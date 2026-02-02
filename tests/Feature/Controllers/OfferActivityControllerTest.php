<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferActivity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferActivityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_activities()
    {
        $this->actingAs($this->user);

        OfferActivity::factory()->create([
            'removed' => false,
            'name' => 'Attività Test 1',
        ]);

        OfferActivity::factory()->create([
            'removed' => false,
            'name' => 'Attività Test 2',
        ]);

        $response = $this->get('/offers/activities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('activities')
            ->has('activities.data')
        );
    }

    #[Test]
    public function it_filters_activities_by_search()
    {
        $this->actingAs($this->user);

        OfferActivity::factory()->create([
            'removed' => false,
            'name' => 'Attività Alpha',
        ]);

        OfferActivity::factory()->create([
            'removed' => false,
            'name' => 'Attività Beta',
        ]);

        $response = $this->get('/offers/activities?search=Alpha');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('activities.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Attività Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-activities.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferActivities/Create'));
    }

    #[Test]
    public function it_stores_new_activity()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-activities.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'Nuova Attività',
        ]);

        $response->assertRedirect(route('offer-activities.index'));
        $response->assertSessionHas('success', 'Attività creata con successo.');

        $this->assertDatabaseHas('offeractivity', [
            'name' => 'Nuova Attività',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-activities.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_shows_activity_details()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create([
            'name' => 'Attività Test',
            'removed' => false,
        ]);

        $response = $this->get(route('offer-activities.show', $activity));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferActivities/Show')
            ->has('activity')
            ->where('activity.name', 'Attività Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create([
            'name' => 'Attività Test',
            'removed' => false,
        ]);

        $response = $this->get(route('offer-activities.edit', $activity));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferActivities/Edit')
            ->has('activity')
            ->where('activity.name', 'Attività Test')
        );
    }

    #[Test]
    public function it_updates_activity()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create([
            'name' => 'Attività Originale',
            'removed' => false,
        ]);

        $response = $this->put(route('offer-activities.update', $activity), [
            'name' => 'Attività Aggiornata',
        ]);

        $response->assertRedirect(route('offer-activities.index'));
        $response->assertSessionHas('success', 'Attività aggiornata con successo.');

        $this->assertDatabaseHas('offeractivity', [
            'id' => $activity->id,
            'name' => 'Attività Aggiornata',
        ]);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create();

        $response = $this->put(route('offer-activities.update', $activity), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_soft_deletes_activity()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create([
            'name' => 'Attività da Eliminare',
            'removed' => false,
        ]);

        $response = $this->delete(route('offer-activities.destroy', $activity));

        $response->assertRedirect(route('offer-activities.index'));
        $response->assertSessionHas('success', 'Attività eliminata con successo.');

        $activity->refresh();
        $this->assertTrue($activity->removed);
    }

    #[Test]
    public function it_only_shows_active_activities()
    {
        $this->actingAs($this->user);

        OfferActivity::factory()->create([
            'name' => 'Attività Attiva',
            'removed' => false,
        ]);

        OfferActivity::factory()->create([
            'name' => 'Attività Eliminata',
            'removed' => true,
        ]);

        $response = $this->get('/offers/activities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('activities.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Attività Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_activities()
    {
        $this->actingAs($this->user);

        OfferActivity::factory()->count(20)->create(['removed' => false]);

        $response = $this->get('/offers/activities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('activities')
            ->where('activities.current_page', 1)
            ->where('activities.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        OfferActivity::factory()->create([
            'removed' => false,
            'name' => 'Attività Test',
        ]);

        $response = $this->get('/offers/activities?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('activities.data', [])
        );
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-activities.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-activities.store'), [
            'uuid' => 'invalid-uuid',
            'name' => 'Test Activity',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $uuid = \Illuminate\Support\Str::uuid()->toString();
        OfferActivity::factory()->create(['uuid' => $uuid]);

        $response = $this->post(route('offer-activities.store'), [
            'uuid' => $uuid,
            'name' => 'Test Activity',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $activity = OfferActivity::factory()->create();

        $response = $this->put(route('offer-activities.update', $activity), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }
}
