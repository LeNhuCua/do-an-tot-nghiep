<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
</head>

<body>
    <h2>Xác nhận tài khoản</h2>
    <p>Xin chào {{ $user->fullName }},</p>
    <p>Vui lòng nhấp vào liên kết bên dưới để xác nhận tài khoản của bạn:</p>
    <a href="{{ $confirmationLink }}">Xác nhận tài khoản</a>
</body>

</html>