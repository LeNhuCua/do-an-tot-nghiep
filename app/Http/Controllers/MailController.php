<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\DemoEmail;
use Illuminate\Support\Facades\Auth;

class MailController extends Controller
{
    public function sendEmail(Request $request)
    {
        // Lấy thông tin từ request
        // $to = $request->input('to');
        // $subject = $request->input('subject');
        // $content = $request->input('content');
        $userEmail = Auth::user()->email;
        $emailData = $request->all();
        Mail::to($userEmail)->send(new DemoEmail($emailData['subject'], $emailData['body']));
        // Gửi email
        // Mail::to($to)->send(new DemoEmail($subject, $content));

        // Trả về kết quả
        return response()->json([
            'status' => 400,
            'message' => 'Email sent'
        ]);
    }
}
