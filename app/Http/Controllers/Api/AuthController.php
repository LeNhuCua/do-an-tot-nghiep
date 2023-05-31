<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Resources\UserResource;
use App\Models\Admin;
use App\Models\Slide;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PHPExcel_Cell;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Maatwebsite\Excel\Facades\Excel;
// use Maatwebsite\Excel\Facades\Excel;
// use Maatwebsite\Excel\Facades\Excel;


class AuthController extends Controller
{

    use AuthorizesRequests, ValidatesRequests;


    



    public function  edit_user(Request $request)
    {

        $userId = Auth::user()->userId;
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $product = User::findOrFail($userId);
                $product->fullName  = $request->fullName;
                $product->email  = $request->email;
                $product->birthday  = $request->birthday;
                $product->phoneNumber  = $request->phoneNumber;
                $product->gender  = $request->gender;
                $product->save();


                if ($request->hasFile('avatar')) {
                    if ($product->avatar) {
                        $exists = Storage::disk('public')->exists("product/image/{$product->avatar}");
                        if ($exists) {
                            Storage::disk('public')->delete("product/image/{$product->avatar}");
                        }
                    }
                    $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
                    $request->file('avatar')->storeAs('product/image', $imageName, 'public');
                    $product->avatar = $imageName;
                }
                $product->save();


     
                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'product' => $product,
     

                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 201,
                    'message' => 'Failed to update product: ' . $e->getMessage()
                ]);
            }
        }
    }








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
            $admin = Admin::create([
                'userId' =>  $newMaNV,
                'fullName' => $request->fullName,
                'email' => $request->email,
                'account' => $request->account,
                'password' => Hash::make($request->password),
                'isManager' => $request->isManager,
            ]);
            if ($admin) { // check if Admin is created
                $token = $admin->createToken('main')->plainTextToken;
                return response(compact('admin', 'token'));
            } else { // Admin not created
                return response()->json([
                    'status' => 500,
                    'message' => 'Đã có lỗi xảy ra khi đăng kí',
                ]);
            }
        }
    }
    public function login(Request $request)
    {
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'max' => 'Trường :attribute không được vượt quá :max.',
            'unique' => 'Trường :attribute đã tồn tại.',
            'email' => 'The :attribute phải là email',
        ];


        $credentials = $request->only('account', 'password');

        $validator = Validator::make($credentials, [
            'account' => 'required',
            'password' => 'required|min:3',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validation_error' => $validator->errors(),
                'message' => 'Hay kiem tra lai thong tin dang nhap',
            ]);
        }
        if (Auth::attempt($credentials)) {
            $admin = Auth::user();

            if ($admin->confirmed) {
                // Người dùng đã được xác nhận
                $token = $admin->createToken('main')->plainTextToken;
                $cookie = cookie('jwt', $token, 60 * 24); // 1 day

                return response()->json([
                    'status' => 200,
                    'username' => $admin->fullName,
                    'token' => $token,
                    'message' => 'Đăng nhập thành công',
                    'user' => $request->user()
                ])->withCookie($cookie);
            } else {
                // Người dùng chưa được xác nhận
                return response()->json([
                    'status' => 401,
                    'message' => "Vui lòng vào email để xác nhận",
                ]);
            }
        }
        // return new UserResource(auth()->user());
        return response()->json([
            'status' => 401,
            'message' => "Tài khoản hoặc mật khẩu không chính xác",
        ]);


        // $credentials = $request->only('account', 'password');
        // if (Auth::attempt($credentials)) {
        //     $user = Auth::user();
        //     $token = $user->createToken('admin-token')->plainTextToken;
        //     return response()->json([
        //         'status' => 200,
        //         // 'username' => $admin->fullName,
        //         'token' => $token,
        //         'message' => 'Dang nhap thanh cong',
        //     ]);
        // } else {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }
    }

    // public function login(Request $request)
    // {
    //     $messages = [
    //         'required' => 'Trường :attribute phải nhập',
    //         'max' => 'Trường :attribute không được vượt quá :max.',
    //         'unique' => 'Trường :attribute đã tồn tại.',
    //         'email' => 'The :attribute phải là email',
    //     ];

    //     $validator = Validator::make($request->all(), [
    //         'account' => 'required',
    //         'password' => 'required|min:3',
    //     ], $messages);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 422,
    //             'validation_error' => $validator->errors(),
    //             'message' => 'Hay kiem tra lai thong tin dang nhap',
    //         ]);
    //     } else {
    //         $admin = Admin::where('account', $request->account)->first();
    //         if (!$admin || !Hash::check($request->password, $admin->password)) {
    //             return response()->json([
    //                 'status' => 401,
    //                 'message' => "Tài khoản hoặc mật khẩu không chính xác",
    //             ]);
    //         } else {
    //             $token =  $admin->createToken($admin->account . '_Token')->plainTextToken;

    //             return response()->json([
    //                 'status' => 200,
    //                 'username' => $admin->fullName,
    //                 'token' => $token,
    //                 'message' => 'Dang nhap thanh cong',
    //             ]);
    //         }
    //     }
    // }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $admin */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function logged_user()
    {
        $loggeduser = Auth::user();
        return response([
            'user' => $loggeduser,
            'message' => 'Logged User Data',
            'status' => 'success'
        ], 200);
    }


    public function uploadExcel(Request $request)
    {

        header("Access-Control-Allow-Origin: " . $request->header('Origin'));
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        $file = $request->file('file');
        Excel::import(new Slide, $file->store('temp'));

        return response()->json(['message' => 'Data added successfully.']);
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
                    'link' => $row[0],
                    'image' => $row[1],
                    'name' => $row[2],
                    'status' => $row[3],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            Slide::insert($dataToSave);

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Import successful',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => 'Unexpected error: ' . $e->getMessage(),
            ]);
        }
    }



    // public function importExcel(Request $request)
    // {




    //     try {
    //         $file = $request->file('file');
    //         $reader = \PHPExcel_IOFactory::createReaderForFile($file->getPathname());
    //         $sheet = $reader->load($file->getPathname());
    //         $rows = $sheet->getActiveSheet()->toArray();

    //         // Kiểm tra và xử lý dữ liệu
    //         $dataToSave = [];

    //         foreach ($rows as $row) {
    //             $dataToSave[] = [
    //                 'link' => $row[1],
    //                 'image' => $row[2],
    //                 'name' => $row[3],
    //                 'status' => $row[4],
    //             ];
    //         }

    //         // Lưu dữ liệu vào cơ sở dữ liệu sử dụng Eloquent ORM
    //         $savedData = [];
    //         foreach ($dataToSave as $data) {
    //             $savedData[] = Slide::create($data);
    //         }

    //         // Trả về phản hồi cho phía frontend
    //         return response()->json([
    //             header("Access-Control-Allow-Origin: http://127.0.0.1:3000"),// Chỉ cho phép truy cập từ http://127.0.0.1:3000
    //             header("Access-Control-Allow-Credentials: true"),
    //             header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"),
    //             'status' => 401,
    //             'message' => 'Thành công',
    //         ]);
    //     } catch (\Exception $e) {
    //         // Xử lý lỗi
    //         return response()->json([
    //             header("Access-Control-Allow-Origin: http://127.0.0.1:3000"),// Chỉ cho phép truy cập từ http://127.0.0.1:3000
    //             header("Access-Control-Allow-Credentials: true"),
    //             header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"),
    //             'status' => 422,
    //             'message' => 'Lỗi không mong đợi: ' . $e->getMessage(),
    //         ]);
    //     }
    // }


    private function readExcel($file)
    {
        $reader = \PHPExcel_IOFactory::createReaderForFile($file);
        $spreadsheet = $reader->load($file);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = [];
        foreach ($worksheet->getRowIterator() as $row) {
            $cells = [];
            foreach ($row->getCellIterator() as $cell) {
                $cells[] = $cell->getValue();
            }
            $rows[] = $cells;
        }
        return $rows;
    }
}
