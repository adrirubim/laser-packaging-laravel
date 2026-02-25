<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PurgeDeletedUsers extends Command
{
    protected $signature = 'users:purge-deleted
                            {--days=30 : Number of days after deletion before permanent purge}';

    protected $description = 'Permanently delete soft-deleted users after the grace period';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $threshold = now()->subDays($days);

        $count = User::onlyTrashed()
            ->where('deleted_at', '<=', $threshold)
            ->forceDelete();

        $this->info("Permanently deleted {$count} user(s) deleted more than {$days} days ago.");

        return self::SUCCESS;
    }
}
