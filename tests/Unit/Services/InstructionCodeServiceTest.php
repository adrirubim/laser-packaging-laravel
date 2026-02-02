<?php

namespace Tests\Unit\Services;

use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use App\Services\InstructionCodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class InstructionCodeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected InstructionCodeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InstructionCodeService;
    }

    #[Test]
    public function it_generates_ic_code_starting_from_ic0001()
    {
        $code = $this->service->generateNextIC();

        $this->assertSame('IC0001', $code);
    }

    #[Test]
    public function it_generates_sequential_ic_codes()
    {
        ArticleIC::factory()->create([
            'code' => 'IC0005',
            'removed' => false,
        ]);

        $code = $this->service->generateNextIC();

        $this->assertSame('IC0006', $code);
    }

    #[Test]
    public function it_generates_io_code_starting_from_io0001()
    {
        $code = $this->service->generateNextIO();

        $this->assertSame('IO0001', $code);
    }

    #[Test]
    public function it_generates_sequential_io_codes()
    {
        ArticleIO::factory()->create([
            'code' => 'IO0010',
            'removed' => false,
        ]);

        $code = $this->service->generateNextIO();

        $this->assertSame('IO0011', $code);
    }

    #[Test]
    public function it_generates_ip_code_starting_from_ip0001()
    {
        $code = $this->service->generateNextIP();

        $this->assertSame('IP0001', $code);
    }

    #[Test]
    public function it_generates_sequential_ip_codes()
    {
        ArticleIP::factory()->create([
            'code' => 'IP0099',
            'removed' => false,
        ]);

        $code = $this->service->generateNextIP();

        $this->assertSame('IP0100', $code);
    }
}
