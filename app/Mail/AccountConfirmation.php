<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $confirmationLink;

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->confirmationLink = url('/api/confirm-account/' . $user->confirmation_token);
    }

    public function build()
    {
        return $this->subject('Account Confirmation')
            ->view('account_confirmation')
            ->with([
                'user' => $this->user,
                'confirmationLink' => url('/api/confirm-account/' . $this->user->confirmation_token)
            ]);
    }
}
