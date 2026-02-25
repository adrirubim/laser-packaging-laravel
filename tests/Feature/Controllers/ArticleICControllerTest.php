<?php

namespace Tests\Feature\Controllers;

use App\Models\ArticleIC;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleICControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_packaging_instructions()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
            'number' => '0001',
        ]);

        $instruction2 = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC002',
            'number' => '0002',
        ]);

        $response = $this->get(route('articles.packaging-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(2, $data);
                $codes = collect($data)->pluck('code')->toArray();
                $this->assertContains('IC001', $codes);
                $this->assertContains('IC002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_instructions_in_index()
    {
        $this->actingAs($this->user);

        $activeInstruction = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
        ]);

        $removedInstruction = ArticleIC::factory()->create([
            'removed' => true,
            'code' => 'IC002',
        ]);

        $response = $this->get(route('articles.packaging-instructions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IC001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_instructions_by_search_term()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
            'number' => '0001',
            'filename' => 'test1.pdf',
        ]);

        $instruction2 = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC002',
            'number' => '0002',
            'filename' => 'other.pdf',
        ]);

        $response = $this->get(route('articles.packaging-instructions.index', ['search' => 'test1']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instructions')
            ->has('instructions.data')
            ->where('instructions.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('IC001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.packaging-instructions.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/PackagingInstructions/Create')
        );
    }

    #[Test]
    public function it_creates_packaging_instruction_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.packaging-instructions.store'), [
            'code' => 'IC001',
            'number' => '0001',
            'filename' => 'test.pdf',
        ]);

        $response->assertRedirect(route('articles.packaging-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesic', [
            'code' => 'IC001',
            'number' => '0001',
            'filename' => 'test.pdf',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.packaging-instructions.store'), [
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_code_uniqueness()
    {
        $this->actingAs($this->user);

        ArticleIC::factory()->create([
            'code' => 'IC001',
            'removed' => false,
        ]);

        $response = $this->post(route('articles.packaging-instructions.store'), [
            'code' => 'IC001',
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_displays_show_page_with_instruction_details()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
            'number' => '0001',
            'filename' => 'test.pdf',
        ]);

        $response = $this->get(route('articles.packaging-instructions.show', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IC001')
            ->where('instruction.number', '0001')
            ->where('instruction.filename', 'test.pdf')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
        ]);

        $response = $this->get(route('articles.packaging-instructions.edit', $instruction->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('instruction')
            ->where('instruction.code', 'IC001')
        );
    }

    #[Test]
    public function it_updates_packaging_instruction_successfully()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
            'number' => '0001',
        ]);

        $response = $this->put(route('articles.packaging-instructions.update', $instruction->uuid), [
            'code' => 'IC001',
            'number' => '0002',
            'filename' => 'updated.pdf',
        ]);

        $response->assertRedirect(route('articles.packaging-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesic', [
            'id' => $instruction->id,
            'code' => 'IC001',
            'number' => '0002',
            'filename' => 'updated.pdf',
        ]);
    }

    #[Test]
    public function it_validates_code_uniqueness_on_update()
    {
        $this->actingAs($this->user);

        $instruction1 = ArticleIC::factory()->create([
            'code' => 'IC001',
            'removed' => false,
        ]);

        $instruction2 = ArticleIC::factory()->create([
            'code' => 'IC002',
            'removed' => false,
        ]);

        $response = $this->put(route('articles.packaging-instructions.update', $instruction2->uuid), [
            'code' => 'IC001',
            'number' => '0001',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_soft_deletes_packaging_instruction()
    {
        $this->actingAs($this->user);

        $instruction = ArticleIC::factory()->create([
            'removed' => false,
            'code' => 'IC001',
        ]);

        $response = $this->delete(route('articles.packaging-instructions.destroy', $instruction->uuid));

        $response->assertRedirect(route('articles.packaging-instructions.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlesic', [
            'id' => $instruction->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_generates_ic_number_correctly()
    {
        $this->actingAs($this->user);

        // Create some instructions with code IC
        ArticleIC::factory()->create([
            'code' => 'IC',
            'number' => '0001',
            'removed' => false,
        ]);

        ArticleIC::factory()->create([
            'code' => 'IC',
            'number' => '0005',
            'removed' => false,
        ]);

        $response = $this->getJson(route('articles.packaging-instructions.generate-ic-number'));

        $response->assertStatus(200);
        $response->assertJson([
            'number' => '0006',
        ]);
    }

    #[Test]
    public function it_generates_ic_number_starting_from_one_when_no_records_exist()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('articles.packaging-instructions.generate-ic-number'));

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
        ArticleIC::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('articles.packaging-instructions.index'));

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
