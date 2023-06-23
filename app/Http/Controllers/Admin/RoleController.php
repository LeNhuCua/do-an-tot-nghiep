<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function role()
    {
        $posts = Role::where('id', '<>', 2)->get();
        return $posts;
    }


}
