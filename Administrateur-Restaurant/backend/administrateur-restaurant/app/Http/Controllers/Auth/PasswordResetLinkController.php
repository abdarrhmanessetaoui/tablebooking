<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Send the reset link (only if the user exists).
        // For security, we ALWAYS return a success message so we don't leak account existence.
        Password::sendResetLink(
            $request->only('email')
        );

        return response()->json([
            'status' => 'passwords.sent',
            'message' => 'Si cet email correspond à un compte, un lien de réinitialisation a été envoyé.'
        ]);
    }
}
