<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordOTP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{

    public function resetPassword(Request $request)
    {
        $request->validate([
            'otp' => 'required',
            'new_password' => 'required|min:2',
        ]);

        $user = DB::table('users')->where('otp', $request->otp)->first();
        if (!$user) {
            return response()->json(['message' => 'Mã OTP không chính xác.', 'status' => 201]);
        }

        if ($user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP.']);
        }

        // Update password
        DB::table('users')->where('otp', $request->otp)->update([
            'password' => Hash::make($request->new_password),
            'otp' => null,
        ]);

        return response()->json(['message' => 'Thay đổi mật khẩu thành công.', 'status' => 200]);
    }

    public function sendOTP(Request $request)
    {
        $request->validate(['account' => 'required']);

        $user = DB::table('users')->where('account', $request->account)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found.', 'status' => 201]);
        }

        // Generate OTP
        $otp = mt_rand(100000, 999999);

        // Save OTP to database
        DB::table('users')->where('account', $request->account)->update(['otp' => $otp]);

        // Send email with OTP
        Mail::to($user->email)->send(new ResetPasswordOTP($otp));

        return response()->json(['message' => 'OTP sent to your email.', 'status' => 200]);
    }
}
