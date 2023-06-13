<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            ['name' => 'Quản lý'],
            ['name' => 'Khách hàng'],
            ['name' => 'Nhân viên'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
