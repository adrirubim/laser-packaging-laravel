<?php

namespace Tests\Feature\Controllers;

use App\Models\ArticleIO;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleIOControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_operational_instructions()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
            'number' => '0001',
        ]);

        $instruction2 = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO002',
            'number' => '0002',
        ]);

        $response = $this->get(route('articles.operational-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(2, $data);
                $codes = collect($data)->pluck('code')->toArray();
                $this->assertContains('IO001', $codes);
                $this->assertContains('IO002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_instructions_in_index()
    {
        $this->actingAs($this->user);

        $activeInstruction = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
        ]);

        $removedInstruction = ArticleIO::factory()->create([
            'removed' => true,
            'code' => 'IO002',
        ]);

        $response = $this->get(route('articles.operational-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IO001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_instructions_by_search_term()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
            'number' => '0001',
            'filename' => 'test1.pdf',
        ]);

        $instruction2 = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO002',
            'number' => '0002',
            'filename' => 'other.pdf',
        ]);

        $response = $this->get(route('articles.operational-instructions.index', ['search' => 'test1']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IO001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.operational-instructions.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/OperationalInstructions/Create')
        );
    }

    #[Test]
    public function it_creates_operational_instruction_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.operational-instructions.store'), [
            'code' => 'IO001',
            'number' => '0001',
            'filename' => 'test.pdf',
        ]);

        $response->assertRedirect(route('articles.operational-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesio', [
            'code' => 'IO001',
            'number' => '0001',
            'filename' => 'test.pdf',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.operational-instructions.store'), [
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_code_uniqueness()
    {
        $this->actingAs($this->user);

        ArticleIO::factory()->create([
            'code' => 'IO001',
            'removed' => false,
        ]);

        $response = $this->post(route('articles.operational-instructions.store'), [
            'code' => 'IO001',
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_displays_show_page_with_instruction_details()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
            'number' => '0001',
            'filename' => 'test.pdf',
        ]);

        $response = $this->get(route('articles.operational-instructions.show', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IO001')
            ->where('instruction.number', '0001')
            ->where('instruction.filename', 'test.pdf')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
        ]);

        $response = $this->get(route('articles.operational-instructions.edit', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IO001')
        );
    }

    #[Test]
    public function it_updates_operational_instruction_successfully()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
            'number' => '0001',
        ]);

        $response = $this->put(route('articles.operational-instructions.update', $instruction->uuid), [
            'code' => 'IO001',
            'number' => '0002',
            'filename' => 'updated.pdf',
        ]);

        $response->assertRedirect(route('articles.operational-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesio', [
            'id' => $instruction->id,
            'code' => 'IO001',
            'number' => '0002',
            'filename' => 'updated.pdf',
        ]);
    }

    #[Test]
    public function it_validates_code_uniqueness_on_update()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIO::factory()->create([
            'code' => 'IO001',
            'removed' => false,
        ]);

        $instruction2 = ArticleIO::factory()->create([
            'code' => 'IO002',
            'removed' => false,
        ]);

        $response = $this->put(route('articles.operational-instructions.update', $instruction2->uuid), [
            'code' => 'IO001',
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_soft_deletes_operational_instruction()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIO::factory()->create([
            'removed' => false,
            'code' => 'IO001',
        ]);

        $response = $this->delete(route('articles.operational-instructions.destroy', $instruction->uuid));

        $response->assertRedirect(route('articles.operational-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesio', [
            'id' => $instruction->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_generates_io_number_correctly()
    {
        $this->actingAs($this->user);

        // Create some instructions with code IO
        ArticleIO::factory()->create([
            'code' => 'IO',
            'number' => '0001',
            'removed' => false,
        ]);

        ArticleIO::factory()->create([
            'code' => 'IO',
            'number' => '0005',
            'removed' => false,
        ]);

        $response = $this->getJson(route('articles.operational-instructions.generate-io-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'number' => '0006',
        ]);
    }

    #[Test]
    public function it_generates_io_number_starting_from_one_when_no_records_exist()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('articles.operational-instructions.generate-io-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'number' => '0001',
        ]);
    }

    #[Test]
    public function it_paginates_instructions()
    {
        $this->actingAs($this->user);

        // Create more than 15 instructions to test pagination
        ArticleIO::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('articles.operational-instructions.index'));

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
