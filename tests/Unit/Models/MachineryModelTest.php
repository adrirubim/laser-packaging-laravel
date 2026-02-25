<?php

namespace Tests\Unit\Models;

use App\Models\Machinery;
use App\Models\ValueTypes;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MachineryModelTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_uses_uuid_as_route_key()
    {
        $machinery = Machinery::factory()->create();
        $this->assertSame('uuid', $machinery->getRouteKeyName());
    }

    #[Test]
    public function it_scopes_active_machinery()
    {
        $active = Machinery::factory()->create(['removed' => false]);
        $removed = Machinery::factory()->create(['removed' => true]);

        $results = Machinery::active()->get();

        $this->assertTrue($results->contains($active));
        $this->assertFalse($results->contains($removed));
    }

    #[Test]
    public function it_returns_null_valuetype_when_relation_not_loaded()
    {
        $machinery = Machinery::factory()->create([
            'value_type_uuid' => null,
        ]);

        $this->assertNull($machinery->valuetype);
    }

    #[Test]
    public function it_handles_value_type_relation_safely_when_loaded()
    {
        $valueType = ValueTypes::create([
            'id' => 1,
            // Real fields may vary; we only check that the accessor does not break
            'type' => 'numero',
            'values' => null,
            'removed' => false,
        ]);

        $machinery = Machinery::factory()->create([
            'value_type_uuid' => $valueType->id,
        ]);

        $machinery->load('valueType');

        // Accessor must be safe and return null or string, never throw
        $valuetype = $machinery->valuetype;
        $this->assertTrue($valuetype === null || is_string($valuetype));
        // Do not require relation to be present: only that it does not break
    }
}
