<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use App\Models\ValueTypes;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ValueTypesControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_value_types()
    {
        $this->actingAs($this->user);

        ValueTypes::factory()->create(['removed' => false]);
        ValueTypes::factory()->create(['removed' => false]);

        $response = $this->get('/value-types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('valueTypes')->has('valueTypes.data'));
    }

    #[Test]
    public function it_stores_new_value_type()
    {
        $this->actingAs($this->user);

        $uuid = '550e8400-e29b-41d4-a716-446655440000';

        $response = $this->post(route('value-types.store'), [
            'uuid' => $uuid,
        ]);

        $response->assertRedirect(route('value-types.index'));
        $response->assertSessionHas('success', 'Tipo di valore creato con successo.');
        $this->assertDatabaseHas('valuetypes', ['uuid' => $uuid, 'removed' => false]);
    }

    #[Test]
    public function it_updates_value_type()
    {
        $this->actingAs($this->user);

        $valueType = ValueTypes::factory()->create(['removed' => false]);
        $newUuid = '660e8400-e29b-41d4-a716-446655440001';

        $response = $this->put(route('value-types.update', $valueType), [
            'uuid' => $newUuid,
        ]);

        $response->assertRedirect(route('value-types.index'));
        $this->assertDatabaseHas('valuetypes', ['id' => $valueType->id, 'uuid' => $newUuid]);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('value-types.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ValueTypes/Create'));
    }

    #[Test]
    public function it_shows_value_type_details()
    {
        $this->actingAs($this->user);

        $valueType = ValueTypes::factory()->create(['removed' => false]);

        $response = $this->get(route('value-types.show', $valueType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ValueTypes/Show')
            ->has('valueType')
            ->where('valueType.uuid', $valueType->uuid)
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $valueType = ValueTypes::factory()->create(['removed' => false]);

        $response = $this->get(route('value-types.edit', $valueType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ValueTypes/Edit')
            ->has('valueType')
            ->where('valueType.uuid', $valueType->uuid)
        );
    }

    #[Test]
    public function it_deletes_value_type_softly()
    {
        $this->actingAs($this->user);

        $valueType = ValueTypes::factory()->create(['removed' => false]);

        $response = $this->delete(route('value-types.destroy', $valueType));

        $response->assertRedirect(route('value-types.index'));
        $response->assertSessionHas('success', 'Tipo di valore eliminato con successo.');

        $valueType->refresh();
        $this->assertTrue($valueType->removed);
    }

    #[Test]
    public function it_filters_value_types_by_search()
    {
        $this->actingAs($this->user);

        $uuid1 = '550e8400-e29b-41d4-a716-446655440000';
        $uuid2 = '660e8400-e29b-41d4-a716-446655440001';

        ValueTypes::factory()->create(['uuid' => $uuid1, 'removed' => false]);
        ValueTypes::factory()->create(['uuid' => $uuid2, 'removed' => false]);
        ValueTypes::factory()->create(['removed' => false]);

        $response = $this->get('/value-types?search=550e8400');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ValueTypes/Index')
            ->has('valueTypes.data', 1)
            ->where('valueTypes.data.0.uuid', $uuid1)
        );
    }

    #[Test]
    public function it_excludes_removed_value_types_from_index()
    {
        $this->actingAs($this->user);

        ValueTypes::factory()->create(['removed' => false]);
        ValueTypes::factory()->create(['removed' => true]);

        $response = $this->get('/value-types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ValueTypes/Index')
            ->has('valueTypes.data', 1)
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        // UUID auto-generated, so it's not required
        $response = $this->post(route('value-types.store'), []);

        $response->assertRedirect(route('value-types.index'));
        $response->assertSessionHas('success', 'Tipo di valore creato con successo.');

        // Verify a record was created with auto-generated UUID
        $this->assertDatabaseHas('valuetypes', [
            'removed' => false,
        ]);
        $valueType = ValueTypes::where('removed', false)->first();
        $this->assertNotNull($valueType->uuid);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('value-types.store'), [
            'uuid' => 'invalid-uuid',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $uuid = '550e8400-e29b-41d4-a716-446655440000';
        ValueTypes::factory()->create(['uuid' => $uuid]);

        $response = $this->post(route('value-types.store'), [
            'uuid' => $uuid,
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }
}
