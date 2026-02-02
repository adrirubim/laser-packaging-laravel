<?php

namespace Tests\Feature\Controllers;

use App\Models\ArticleIP;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleIPControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_palletization_instructions()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
        ]);

        $instruction2 = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP002',
        ]);

        $response = $this->get(route('articles.palletization-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(2, $data);
                $codes = collect($data)->pluck('code')->toArray();
                $this->assertContains('IP001', $codes);
                $this->assertContains('IP002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_instructions_in_index()
    {
        $this->actingAs($this->user);

        $activeInstruction = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
        ]);

        $removedInstruction = ArticleIP::factory()->create([
            'removed' => true,
            'code' => 'IP002',
        ]);

        $response = $this->get(route('articles.palletization-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IP001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_instructions_by_search_term()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
            'filename' => 'test1.pdf',
        ]);

        $instruction2 = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP002',
            'filename' => 'other.pdf',
        ]);

        $response = $this->get(route('articles.palletization-instructions.index', ['search' => 'test1']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IP001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.palletization-instructions.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/PalletizationInstructions/Create')
        );
    }

    #[Test]
    public function it_creates_palletization_instruction_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.palletization-instructions.store'), [
            'code' => 'IP001',
            'length_cm' => 10.5,
            'depth_cm' => 20.5,
            'height_cm' => 30.5,
            'volume_dmc' => 6.4,
            'plan_packaging' => 5,
            'pallet_plans' => 3,
            'qty_pallet' => 15,
            'units_per_neck' => 2,
            'units_pallet' => 30,
            'interlayer_every_floors' => 2,
            'filename' => 'test.pdf',
        ]);

        $response->assertRedirect(route('articles.palletization-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesip', [
            'code' => 'IP001',
            'length_cm' => 10.5,
            'depth_cm' => 20.5,
            'height_cm' => 30.5,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.palletization-instructions.store'), [
            'length_cm' => 10.5,
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_code_uniqueness()
    {
        $this->actingAs($this->user);

        ArticleIP::factory()->create([
            'code' => 'IP001',
            'removed' => false,
        ]);

        $response = $this->post(route('articles.palletization-instructions.store'), [
            'code' => 'IP001',
            'length_cm' => 10.5,
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_numeric_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.palletization-instructions.store'), [
            'code' => 'IP001',
            'length_cm' => 'invalid',
        ]);

        $response->assertSessionHasErrors(['length_cm']);
    }

    #[Test]
    public function it_displays_show_page_with_instruction_details()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
            'length_cm' => 10.5,
            'filename' => 'test.pdf',
        ]);

        $response = $this->get(route('articles.palletization-instructions.show', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IP001')
            ->where('instruction.length_cm', function ($value) {
                return abs((float) $value - 10.5) < 0.01;
            })
            ->where('instruction.filename', 'test.pdf')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
        ]);

        $response = $this->get(route('articles.palletization-instructions.edit', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IP001')
        );
    }

    #[Test]
    public function it_updates_palletization_instruction_successfully()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
            'length_cm' => 10.5,
        ]);

        $response = $this->put(route('articles.palletization-instructions.update', $instruction->uuid), [
            'code' => 'IP001',
            'length_cm' => 15.5,
            'depth_cm' => 25.5,
            'height_cm' => 35.5,
            'filename' => 'updated.pdf',
        ]);

        $response->assertRedirect(route('articles.palletization-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesip', [
            'id' => $instruction->id,
            'code' => 'IP001',
            'length_cm' => 15.5,
        ]);
    }

    #[Test]
    public function it_validates_code_uniqueness_on_update()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIP::factory()->create([
            'code' => 'IP001',
            'removed' => false,
        ]);

        $instruction2 = ArticleIP::factory()->create([
            'code' => 'IP002',
            'removed' => false,
        ]);

        $response = $this->put(route('articles.palletization-instructions.update', $instruction2->uuid), [
            'code' => 'IP001',
            'length_cm' => 10.5,
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_soft_deletes_palletization_instruction()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIP::factory()->create([
            'removed' => false,
            'code' => 'IP001',
        ]);

        $response = $this->delete(route('articles.palletization-instructions.destroy', $instruction->uuid));

        $response->assertRedirect(route('articles.palletization-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesip', [
            'id' => $instruction->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_generates_ip_number_correctly()
    {
        $this->actingAs($this->user);

        // Crear algunas instrucciones con code IP
        ArticleIP::factory()->create([
            'code' => 'IP',
            'number' => '0001',
            'removed' => false,
        ]);

        ArticleIP::factory()->create([
            'code' => 'IP',
            'number' => '0005',
            'removed' => false,
        ]);

        $response = $this->getJson(route('articles.palletization-instructions.generate-ip-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'number' => '0006',
        ]);
    }

    #[Test]
    public function it_generates_ip_number_starting_from_one_when_no_records_exist()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('articles.palletization-instructions.generate-ip-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'number' => '0001',
        ]);
    }

    #[Test]
    public function it_paginates_instructions()
    {
        $this->actingAs($this->user);

        // Crear más de 15 instrucciones para probar paginación
        ArticleIP::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('articles.palletization-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }
}
