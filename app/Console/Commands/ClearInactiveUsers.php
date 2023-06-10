<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ClearInactiveUsers extends Command
{
    protected $signature = 'clear:inactive_users';

    protected $description = 'Clears inactive users who have not logged in for 3 months';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $inactiveUsers = User::where('last_login_at', '<=', Carbon::now()->subMonths(3))->get();

        foreach ($inactiveUsers as $user) {
            // Xoá bản ghi trong bảng giỏ hàng
            $user->cartItems()->delete();

            // Xoá người dùng
            $user->delete();
        }

        $this->info('Inactive users cleared successfully.');
    }
}
