<?php

namespace Tests\Feature\Controllers;

use App\Models\PalletSheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PalletSheetControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_pallet_sheets()
    {
        $this->actingAs($this->user);

        $sheet1 = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
        ]);

        $sheet2 = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP002',
        ]);

        $response = $this->get(route('articles.pallet-sheets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheets')
            ->has('sheets.data')
            ->where('sheets.data', function ($data) {
                $this->assertCount(2, $data);
                $codes = collect($data)->pluck('code')->toArray();
                $this->assertContains('FP001', $codes);
                $this->assertContains('FP002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_sheets_in_index()
    {
        $this->actingAs($this->user);

        $activeSheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
        ]);

        $removedSheet = PalletSheet::factory()->create([
            'removed' => true,
            'code' => 'FP002',
        ]);

        $response = $this->get(route('articles.pallet-sheets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheets')
            ->has('sheets.data')
            ->where('sheets.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('FP001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_sheets_by_search_term()
    {
        $this->actingAs($this->user);

        $sheet1 = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'description' => 'Test Sheet 1',
            'filename' => 'test1.pdf',
        ]);

        $sheet2 = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP002',
            'description' => 'Other Sheet',
            'filename' => 'other.pdf',
        ]);

        $response = $this->get(route('articles.pallet-sheets.index', ['search' => 'Test Sheet']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheets')
            ->has('sheets.data')
            ->where('sheets.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('FP001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.pallet-sheets.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/PalletSheets/Create')
        );
    }

    #[Test]
    public function it_creates_pallet_sheet_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.pallet-sheets.store'), [
            'code' => 'FP001',
            'description' => 'Test Sheet',
            'filename' => 'test.pdf',
        ]);

        $response->assertRedirect(route('articles.pallet-sheets.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlefogliopallet', [
            'code' => 'FP001',
            'description' => 'Test Sheet',
            'filename' => 'test.pdf',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.pallet-sheets.store'), [
            'description' => 'Test Sheet',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_requires_description()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.pallet-sheets.store'), [
            'code' => 'FP001',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_validates_code_uniqueness()
    {
        $this->actingAs($this->user);

        PalletSheet::factory()->create([
            'code' => 'FP001',
            'removed' => false,
        ]);

        $response = $this->post(route('articles.pallet-sheets.store'), [
            'code' => 'FP001',
            'description' => 'Test Sheet',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_displays_show_page_with_sheet_details()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'description' => 'Test Sheet',
            'filename' => 'test.pdf',
        ]);

        $response = $this->get(route('articles.pallet-sheets.show', $sheet->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheet')
            ->where('sheet.code', 'FP001')
            ->where('sheet.description', 'Test Sheet')
            ->where('sheet.filename', 'test.pdf')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
        ]);

        $response = $this->get(route('articles.pallet-sheets.edit', $sheet->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheet')
            ->where('sheet.code', 'FP001')
        );
    }

    #[Test]
    public function it_updates_pallet_sheet_successfully()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'description' => 'Old Description',
        ]);

        $response = $this->put(route('articles.pallet-sheets.update', $sheet->uuid), [
            'code' => 'FP001',
            'description' => 'New Description',
            'filename' => 'updated.pdf',
        ]);

        $response->assertRedirect(route('articles.pallet-sheets.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlefogliopallet', [
            'id' => $sheet->id,
            'code' => 'FP001',
            'description' => 'New Description',
            'filename' => 'updated.pdf',
        ]);
    }

    #[Test]
    public function it_validates_code_uniqueness_on_update()
    {
        $this->actingAs($this->user);

        $sheet1 = PalletSheet::factory()->create([
            'code' => 'FP001',
            'removed' => false,
        ]);

        $sheet2 = PalletSheet::factory()->create([
            'code' => 'FP002',
            'removed' => false,
        ]);

        $response = $this->put(route('articles.pallet-sheets.update', $sheet2->uuid), [
            'code' => 'FP001',
            'description' => 'Test Sheet',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_soft_deletes_pallet_sheet()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
        ]);

        $response = $this->delete(route('articles.pallet-sheets.destroy', $sheet->uuid));

        $response->assertRedirect(route('articles.pallet-sheets.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlefogliopallet', [
            'id' => $sheet->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_paginates_sheets()
    {
        $this->actingAs($this->user);

        // Create more than 15 sheets to test pagination
        PalletSheet::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('articles.pallet-sheets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sheets')
            ->has('sheets.data')
            ->where('sheets.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_downloads_file_for_pallet_sheet()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'filename' => 'test-sheet.pdf',
        ]);

        // Create test file
        $filePath = storage_path('app/foglioPallet/'.$sheet->uuid.'/');
        if (! file_exists($filePath)) {
            mkdir($filePath, 0755, true);
        }
        file_put_contents($filePath.'test-sheet.pdf', 'test download content');

        $response = $this->get(route('articles.pallet-sheets.download-file', $sheet->uuid));

        $response->assertStatus(200);
        $response->assertDownload('test-sheet.pdf');

        // Cleanup
        if (file_exists($filePath.'test-sheet.pdf')) {
            unlink($filePath.'test-sheet.pdf');
            rmdir($filePath);
        }
    }

    #[Test]
    public function it_returns_error_when_downloading_nonexistent_file()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'filename' => null,
        ]);

        $response = $this->get(route('articles.pallet-sheets.download-file', $sheet->uuid));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);
    }

    #[Test]
    public function it_returns_error_when_file_does_not_exist_on_disk()
    {
        $this->actingAs($this->user);

        $sheet = PalletSheet::factory()->create([
            'removed' => false,
            'code' => 'FP001',
            'filename' => 'nonexistent.pdf',
        ]);

        $response = $this->get(route('articles.pallet-sheets.download-file', $sheet->uuid));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);
    }
}
