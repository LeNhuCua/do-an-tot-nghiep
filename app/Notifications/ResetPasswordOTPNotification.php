<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordOTPNotification extends Notification
{
    use Queueable;

    public $otp;

    /**
     * Create a new notification instance.
     *
     * @param string $otp
     * @return void
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Password OTP')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->line('OTP: ' . $this->otp)
            ->line('If you did not request a password reset, no further action is required.')
            ->line('Thank you for using our application!');
    }
}
