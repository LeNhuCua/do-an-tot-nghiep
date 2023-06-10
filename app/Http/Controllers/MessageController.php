<?php

namespace App\Http\Controllers;

use App\Events\NewMessageEvent;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $message = new Message();
        $message->sender_id = $request->input('sender_id');
        $message->receiver_id = $request->input('receiver_id');
        $message->content = $request->input('content');
        $message->save();

        // Gửi sự kiện tin nhắn mới đến kênh broadcast
        event(new NewMessageEvent($message));

        return response()->json($message, 201);
    }
}
