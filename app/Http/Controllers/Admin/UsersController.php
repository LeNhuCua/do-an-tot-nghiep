<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Mail\AccountConfirmation;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    public function index()
    {
        $posts = User::orderBy("userId", "desc")->where('role_id', '=', 3)->get();
        return $posts;
    }
    public function role1()
    {
        $posts = Role::where('id', '<>', 2)->get();
        return $posts;
    }




    public function store(Request $request)
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
            $lastUserId = User::selectRaw('SUBSTRING(userId, -5) AS userId')
                ->orderBy('userId', 'desc')
                ->value('userId');
            if ($lastUserId) {
                $newUserIdNumber = substr($lastUserId, -0) + 1;
            }

            if ($lastUserId == null) {
                $newUserId =  'ND00001';
            } else {
                $newUserId =  'ND' . str_pad($newUserIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $user = User::create([
                'userId' =>  $newUserId,
                'fullName' => $request->fullName,
                'email' => $request->email,
                'account' => $request->account,
                'password' => Hash::make($request->password),
                'role_id' => $request->role,
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





    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request, $sizeId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',

        ];
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|max:50',

        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try { {
                    $size = User::findOrFail($sizeId);
                    $size->fullName = $request->fullName;
                    $size->gender = $request->gender;
                    $size->phoneNumber = $request->phoneNumber;
                    $size->save();
                    return response()->json([
                        'status' => 400,
                        'message' => 'Product Updated Successfully!!',

                    ]);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gặp lỗi khi cập nhật!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,

                ]);
            }
        }
    }




    public function importExcel(Request $request)
    {

        try {
            $file = $request->file('file');
            $reader = IOFactory::createReaderForFile($file->getPathname());
            $spreadsheet = $reader->load($file->getPathname());
            $worksheet = $spreadsheet->getSheet(0);
            $rows = $worksheet->toArray();

            // Process and validate the data

            $lastSizeId = User::selectRaw('SUBSTRING(sizeId, -5) AS sizeId')
                ->orderBy('sizeId', 'desc')
                ->value('sizeId');

            if ($lastSizeId) {
                $newSizeIdNumber = substr($lastSizeId, -0) + 1;
            }

            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }
                $newSizeId =  'SIZE' . str_pad($newSizeIdNumber, 5, '0', STR_PAD_LEFT);
                $size = User::where('sizeValue', $row[0])->first();
                if ($size) { // Nếu đã tồn tại thì báo lỗi
                    return response()->json([
                        'status' => 422,
                        'message' => 'Giá trị size là ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else {
                    $product = new User;
                    $product->sizeId =  $newSizeId;
                    $product->sizeValue = $row[0];
                    $product->created_at =  Carbon::now();
                    $product->updated_at = Carbon::now();
                    $product->save();
                    $newSizeIdNumber++;
                }
            }


            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => "Vui lòng điền đủ các trường excel như mẫu. Không được trùng tên và mã",
                'Error' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }


    public function deleteAll(Request $request)
    {
        try {
            $selectedData = $request->input('dataId');

            DB::table('users')->whereIn('userId', $selectedData)->delete();

            return response()->json([
                'status' => 200,
                'message' => "Xoá nhiều sản phẩm thành công",

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => "Lỗi xoá sản phẩm: " . $e->getMessage(),
            ]);
        }
    }
}
