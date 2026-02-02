<?php

namespace Tests\Feature\Controllers;

use App\Models\ModelSCQ;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModelSCQControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_cq_models()
    {
        $this->actingAs($this->user);

        $model1 = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
        ]);

        $model2 = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU002',
        ]);

        $response = $this->get(route('articles.cq-models.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('models')
            ->has('models.data')
            ->where('models.data', function ($data) {
                $this->assertCount(2, $data);
                $codes = collect($data)->pluck('cod_model')->toArray();
                $this->assertContains('CQU001', $codes);
                $this->assertContains('CQU002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_models_in_index()
    {
        $this->actingAs($this->user);

        $activeModel = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
        ]);

        $removedModel = ModelSCQ::factory()->create([
            'removed' => true,
            'cod_model' => 'CQU002',
        ]);

        $response = $this->get(route('articles.cq-models.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('models')
            ->has('models.data')
            ->where('models.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('CQU001', $data[0]['cod_model']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_models_by_search_term()
    {
        $this->actingAs($this->user);

        $model1 = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model 1',
            'filename' => 'test1.pdf',
        ]);

        $model2 = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU002',
            'description_model' => 'Other Model',
            'filename' => 'other.pdf',
        ]);

        $response = $this->get(route('articles.cq-models.index', ['search' => 'Test Model']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('models')
            ->has('models.data')
            ->where('models.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('CQU001', $data[0]['cod_model']);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_create_form_with_generated_cqu_number()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.cq-models.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('cquNumber')
            ->where('cquNumber', function ($cquNumber) {
                $this->assertStringStartsWith('CQU', $cquNumber);

                return true;
            })
        );
    }

    #[Test]
    public function it_creates_cq_model_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.cq-models.store'), [
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model',
            'filename' => 'test.pdf',
        ]);

        $response->assertRedirect(route('articles.cq-models.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('modelscq', [
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model',
            'filename' => 'test.pdf',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_generates_cod_model_when_not_provided()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.cq-models.store'), [
            'description_model' => 'Test Model',
        ]);

        $response->assertRedirect(route('articles.cq-models.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('modelscq', [
            'description_model' => 'Test Model',
            'removed' => false,
        ]);

        $model = ModelSCQ::where('description_model', 'Test Model')->first();
        $this->assertStringStartsWith('CQU', $model->cod_model);
    }

    #[Test]
    public function it_requires_description_model()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.cq-models.store'), [
            'cod_model' => 'CQU001',
        ]);

        $response->assertSessionHasErrors(['description_model']);
    }

    #[Test]
    public function it_validates_cod_model_uniqueness()
    {
        $this->actingAs($this->user);

        ModelSCQ::factory()->create([
            'cod_model' => 'CQU001',
            'removed' => false,
        ]);

        $response = $this->post(route('articles.cq-models.store'), [
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model',
        ]);

        $response->assertSessionHasErrors(['cod_model']);
    }

    #[Test]
    public function it_displays_show_page_with_model_details()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model',
            'filename' => 'test.pdf',
        ]);

        $response = $this->get(route('articles.cq-models.show', $model->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('model')
            ->where('model.cod_model', 'CQU001')
            ->where('model.description_model', 'Test Model')
            ->where('model.filename', 'test.pdf')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
        ]);

        $response = $this->get(route('articles.cq-models.edit', $model->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('model')
            ->where('model.cod_model', 'CQU001')
        );
    }

    #[Test]
    public function it_updates_cq_model_successfully()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'description_model' => 'Old Description',
        ]);

        $response = $this->put(route('articles.cq-models.update', $model->uuid), [
            'cod_model' => 'CQU001',
            'description_model' => 'New Description',
            'filename' => 'updated.pdf',
        ]);

        $response->assertRedirect(route('articles.cq-models.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('modelscq', [
            'id' => $model->id,
            'cod_model' => 'CQU001',
            'description_model' => 'New Description',
            'filename' => 'updated.pdf',
        ]);
    }

    #[Test]
    public function it_validates_cod_model_uniqueness_on_update()
    {
        $this->actingAs($this->user);

        $model1 = ModelSCQ::factory()->create([
            'cod_model' => 'CQU001',
            'removed' => false,
        ]);

        $model2 = ModelSCQ::factory()->create([
            'cod_model' => 'CQU002',
            'removed' => false,
        ]);

        $response = $this->put(route('articles.cq-models.update', $model2->uuid), [
            'cod_model' => 'CQU001',
            'description_model' => 'Test Model',
        ]);

        $response->assertSessionHasErrors(['cod_model']);
    }

    #[Test]
    public function it_soft_deletes_cq_model()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
        ]);

        $response = $this->delete(route('articles.cq-models.destroy', $model->uuid));

        $response->assertRedirect(route('articles.cq-models.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('modelscq', [
            'id' => $model->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_generates_cqu_number_correctly()
    {
        $this->actingAs($this->user);

        // Crear algunos modelos con código CQU
        ModelSCQ::factory()->create([
            'cod_model' => 'CQU001',
            'removed' => false,
        ]);

        ModelSCQ::factory()->create([
            'cod_model' => 'CQU005',
            'removed' => false,
        ]);

        $response = $this->getJson(route('articles.cq-models.generate-cqu-number'));

        $response->assertStatus(200);
        $response->assertJsonStructure(['cqunumber']);
        $jsonData = $response->json();
        $this->assertStringStartsWith('CQU', $jsonData['cqunumber']);
    }

    #[Test]
    public function it_generates_cqu_number_starting_from_one_when_no_records_exist()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('articles.cq-models.generate-cqu-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'cqunumber' => 'CQU001',
        ]);
    }

    #[Test]
    public function it_paginates_models()
    {
        $this->actingAs($this->user);

        // Crear más de 15 modelos para probar paginación
        ModelSCQ::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('articles.cq-models.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('models')
            ->has('models.data')
            ->where('models.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_downloads_file_for_cq_model()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'filename' => 'test-model.pdf',
        ]);

        // Crear archivo de prueba
        $filePath = storage_path('app/modelsCQ/'.$model->uuid.'/');
        if (! file_exists($filePath)) {
            mkdir($filePath, 0755, true);
        }
        file_put_contents($filePath.'test-model.pdf', 'test download content');

        $response = $this->get(route('articles.cq-models.download-file', $model->uuid));

        $response->assertStatus(200);
        $response->assertDownload('test-model.pdf');

        // Limpiar
        if (file_exists($filePath.'test-model.pdf')) {
            unlink($filePath.'test-model.pdf');
            rmdir($filePath);
        }
    }

    #[Test]
    public function it_returns_error_when_downloading_nonexistent_file()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'filename' => null,
        ]);

        $response = $this->get(route('articles.cq-models.download-file', $model->uuid));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);
    }

    #[Test]
    public function it_returns_error_when_file_does_not_exist_on_disk()
    {
        $this->actingAs($this->user);

        $model = ModelSCQ::factory()->create([
            'removed' => false,
            'cod_model' => 'CQU001',
            'filename' => 'nonexistent.pdf',
        ]);

        $response = $this->get(route('articles.cq-models.download-file', $model->uuid));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);
    }
}
