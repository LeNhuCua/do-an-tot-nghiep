<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;

class UsersController extends Controller
{
    public function index()
    {
        $posts = User::orderBy("userId", "desc")->get();
        return $posts;
    }

    // public function lastUserId()
    // {
    //     $lastEmployee = User::orderBy('userId', 'desc')->first();
    //     return $lastEmployee;
    // }

    public function signup(Request $request)
    {
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'max' => 'Trường :attribute không được vượt quá :max.',
            'unique' => 'Trường :attribute đã tồn tại.',
            'email' => 'The :attribute phải là email',
        ];

        $validator = Validator::make($request->all(), [
            'fullName' => 'required',
            'email' => 'required',
            'account' => 'required',
            'password' => 'required|min:3',
            'c_password' => 'required|same:password'
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin đăng kí',
            ]);
        } else {
            $lastEmployee = User::orderBy('userId', 'desc')->first();

            $newMaNV = null;
            if ($lastEmployee == null) {
                $newMaNV = 'NV00001';
            } else {
                $newMaNVNumber = substr($lastEmployee->userId, 2) + 1;
                $newMaNV = 'NV' . str_pad($newMaNVNumber, 5, '0', STR_PAD_LEFT);
            }
            $user = User::create([
                'userId' =>  $newMaNV,
                'fullName' => $request->fullName,
                'email' => $request->email,
                'account' => $request->account,
                'password' => Hash::make($request->password),
                'isManager' => $request->isManager,
                'role_id' => $request->role_id,
            ]);
            // $token = $user->createToken('main')->plainTextToken;
            // return response(compact('user', 'token'));
            if ($user) { // check if user is created
                $token = $user->createToken('main')->plainTextToken;
                return response(compact('user', 'token'));
            } else { // Admin not created
                return response()->json([
                    'status' => 500,
                    'message' => 'Đã có lỗi xảy ra khi đăng kí',
                ]);
            }
        }
    }






    public function show(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request, $userId)
    {
        $request->validate([
            'alias' => 'required',
            'name' => 'required',
            'status' => 'required',
        ]);

        try {
            $sample = User::find($userId);
            $sample->update($request->all());

            return response()->json([
                'message' => 'Product Updated Successfully!!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gặp lỗi khi cập nhật!!'
            ], 500);
        }
    }


    public function destroy(Admin $category)
    {
        try {
            $category->delete();

            return response()->json([
                'message' => 'Xoá thành công!!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xoá!!'
            ]);
        }
    }


    public function importExcel(Request $request)
    {
        try {
            $file = $request->file('file');
            $reader = IOFactory::createReaderForFile($file->getPathname());
            $spreadsheet = $reader->load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Process and validate the data
            $dataToSave = [];


            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }

                $dataToSave[] = [
                    'alias' => $row[0],
                    'name' => $row[1],
                    'status' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            Admin::insert($dataToSave);

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }


    public function deleteAll(Request $request)
    {
        $selectedProducts = $request->input('dataId');

        DB::table('categories')->whereIn('categoryId', $selectedProducts)->delete();

        return response()->json(['message' => 'Selected products deleted successfully.'], 200);
    }
}
