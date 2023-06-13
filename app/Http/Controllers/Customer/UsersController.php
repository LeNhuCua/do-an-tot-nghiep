<?php

namespace App\Http\Controllers\Customer;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Mail\AccountConfirmation;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UsersController extends Controller
{

    public function confirmAccount($token)
    {
        $user = User::where('confirmation_token', $token)->first();

        if (!$user) {
            return response('Mã xác nhận đã hết hạn');
        }
        $user->confirmed = true;
        $user->confirmation_token = null;
        $user->save();
        return response('Tài khoản của bạn đã được xác nhận thành công');
    }

    public function signupCus(Request $request)
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
            'account' => 'required|unique:users',
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
                $newMaNV = 'ND00001';
            } else {
                $newMaNVNumber = substr($lastEmployee->userId, 2) + 1;
                $newMaNV = 'ND' . str_pad($newMaNVNumber, 5, '0', STR_PAD_LEFT);
            }
            $user = User::create([
                'userId' =>  $newMaNV,
                'fullName' => $request->fullName,
                'email' => $request->email,
                'account' => $request->account,
                'password' => Hash::make($request->password),
                'role_id' => 2,
                'confirmation_token' => Str::random(60),

            ]);
            Mail::to($user->email)->send(new AccountConfirmation($user));

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
            User::insert($dataToSave);

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
