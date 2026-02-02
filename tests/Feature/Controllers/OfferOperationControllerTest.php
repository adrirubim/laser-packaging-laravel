<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferOperation;
use App\Models\OfferOperationCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferOperationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_operations()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        OfferOperation::factory()->create([
            'removed' => false,
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
        ]);

        $response = $this->get('/offers/operations');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('operations')->has('operations.data'));
    }

    #[Test]
    public function it_stores_new_operation()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        $response = $this->post(route('offer-operations.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'codice_univoco' => 'UNI-001',
            'descrizione' => 'Descrizione Operazione',
            'secondi_operazione' => 120,
        ]);

        $response->assertRedirect(route('offer-operations.index'));
        $response->assertSessionHas('success', 'Operazione creata con successo.');
        $this->assertDatabaseHas('offeroperation', [
            'codice' => 'OP-001',
            'codice_univoco' => 'UNI-001',
            'descrizione' => 'Descrizione Operazione',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_required_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operations.store'), []);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_filters_by_category()
    {
        $this->actingAs($this->user);

        $category1 = OfferOperationCategory::factory()->create();
        $category2 = OfferOperationCategory::factory()->create();

        OfferOperation::factory()->create([
            'category_uuid' => $category1->uuid,
            'removed' => false,
        ]);

        OfferOperation::factory()->create([
            'category_uuid' => $category2->uuid,
            'removed' => false,
        ]);

        $response = $this->get('/offers/operations?category_uuid='.$category1->uuid);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('operations.data', function ($data) use ($category1) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($category1->uuid, $dataArray[0]['category_uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create();

        $response = $this->get(route('offer-operations.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperations/Create')
            ->has('categories')
        );
    }

    #[Test]
    public function it_shows_create_form_with_category_uuid()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        $response = $this->get(route('offer-operations.create', ['category_uuid' => $category->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperations/Create')
            ->has('categories')
            ->where('category_uuid', $category->uuid)
        );
    }

    #[Test]
    public function it_shows_operation_details()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'descrizione' => 'Operazione Test',
        ]);

        $response = $this->get(route('offer-operations.show', $operation));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperations/Show')
            ->has('operation')
            ->where('operation.codice', 'OP-001')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'descrizione' => 'Operazione Test',
        ]);

        $response = $this->get(route('offer-operations.edit', $operation));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperations/Edit')
            ->has('operation')
            ->has('categories')
            ->where('operation.codice', 'OP-001')
        );
    }

    #[Test]
    public function it_updates_operation()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'descrizione' => 'Operazione Originale',
        ]);

        $response = $this->put(route('offer-operations.update', $operation), [
            'category_uuid' => $category->uuid,
            'codice' => 'OP-002',
            'descrizione' => 'Operazione Aggiornata',
        ]);

        $response->assertRedirect(route('offer-operations.index'));
        $this->assertDatabaseHas('offeroperation', [
            'id' => $operation->id,
            'descrizione' => 'Operazione Aggiornata',
        ]);
    }

    #[Test]
    public function it_soft_deletes_operation()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'removed' => false,
        ]);

        $response = $this->delete(route('offer-operations.destroy', $operation));

        $response->assertRedirect(route('offer-operations.index'));
        $operation->refresh();
        $this->assertTrue($operation->removed);
    }

    #[Test]
    public function it_uploads_file_when_creating_operation()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $uuid = \Illuminate\Support\Str::uuid()->toString();

        $file = \Illuminate\Http\UploadedFile::fake()->create('test.pdf', 100);

        $response = $this->post(route('offer-operations.store'), [
            'uuid' => $uuid,
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'filename' => $file,
        ]);

        $response->assertRedirect(route('offer-operations.index'));
        $this->assertDatabaseHas('offeroperation', [
            'uuid' => $uuid,
            'codice' => 'OP-001',
        ]);

        $operation = OfferOperation::where('uuid', $uuid)->first();
        $this->assertNotNull($operation->filename);
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($operation->filename);
    }

    #[Test]
    public function it_uploads_file_when_updating_operation()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'filename' => null,
        ]);

        $file = \Illuminate\Http\UploadedFile::fake()->create('test-updated.pdf', 100);

        $response = $this->put(route('offer-operations.update', $operation), [
            'category_uuid' => $category->uuid,
            'codice' => 'OP-002',
            'filename' => $file,
        ]);

        $response->assertRedirect(route('offer-operations.index'));
        $operation->refresh();
        $this->assertNotNull($operation->filename);
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($operation->filename);
    }

    #[Test]
    public function it_deletes_old_file_when_uploading_new_one()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $oldFile = \Illuminate\Http\UploadedFile::fake()->create('old.pdf', 100);
        $oldPath = $oldFile->storeAs('offer-operations', 'old_file.pdf', 'public');

        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'filename' => $oldPath,
        ]);

        \Illuminate\Support\Facades\Storage::disk('public')->put($oldPath, 'content');

        $newFile = \Illuminate\Http\UploadedFile::fake()->create('new.pdf', 100);

        $response = $this->put(route('offer-operations.update', $operation), [
            'category_uuid' => $category->uuid,
            'codice' => 'OP-002',
            'filename' => $newFile,
        ]);

        $response->assertRedirect(route('offer-operations.index'));
        \Illuminate\Support\Facades\Storage::disk('public')->assertMissing($oldPath);

        $operation->refresh();
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($operation->filename);
    }

    #[Test]
    public function it_validates_file_size()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();
        $uuid = \Illuminate\Support\Str::uuid()->toString();

        // Crear un archivo mayor a 10MB
        $file = \Illuminate\Http\UploadedFile::fake()->create('large.pdf', 11000); // 11MB

        $response = $this->post(route('offer-operations.store'), [
            'uuid' => $uuid,
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'filename' => $file,
        ]);

        $response->assertSessionHasErrors(['filename']);
    }

    #[Test]
    public function it_filters_operations_by_search_term()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'codice' => 'OP-001',
            'descrizione' => 'Operazione Test',
            'removed' => false,
        ]);

        OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'codice' => 'OP-002',
            'descrizione' => 'Otra Operación',
            'removed' => false,
        ]);

        $response = $this->get(route('offer-operations.index', ['search' => 'Test']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Test')
        );
    }
}
