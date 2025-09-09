<?php

use App\Http\Controllers\AdminSubmissionController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscipleshipController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Discipleship Update Routes
    Route::resource('discipleship', DiscipleshipController::class)->names([
        'index' => 'discipleship.index',
        'create' => 'discipleship.create',
        'store' => 'discipleship.store',
        'show' => 'discipleship.show',
        'edit' => 'discipleship.edit',
        'update' => 'discipleship.update',
        'destroy' => 'discipleship.destroy',
    ]);

    // Additional route for submitting discipleship updates
    Route::patch('discipleship/{discipleshipUpdate}/submit', [DiscipleshipController::class, 'submit'])
        ->name('discipleship.submit');

    // Coach Management Routes
    Route::resource('coaches', CoachController::class);

    // API route for coach list (for dropdowns)
    Route::get('api/coaches/list', [CoachController::class, 'list'])
        ->name('coaches.list');

    // Form Token Management Routes
    Route::resource('tokens', App\Http\Controllers\FormTokenController::class);
    Route::patch('tokens/{token}/deactivate', [App\Http\Controllers\FormTokenController::class, 'deactivate'])
        ->name('tokens.deactivate');
    Route::patch('tokens/{token}/activate', [App\Http\Controllers\FormTokenController::class, 'activate'])
        ->name('tokens.activate');
    Route::patch('tokens/{token}/reset-usage', [App\Http\Controllers\FormTokenController::class, 'resetUsage'])
        ->name('tokens.reset-usage');
});

// Admin routes - require admin middleware
Route::middleware(['auth', 'verified', App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    // Admin Submission Management Routes
    Route::resource('submissions', AdminSubmissionController::class)->except(['create', 'store']);
    
    // Additional admin actions
    Route::post('submissions/{submission}/approve', [AdminSubmissionController::class, 'approve'])
        ->name('submissions.approve');
    Route::post('submissions/{submission}/reject', [AdminSubmissionController::class, 'reject'])
        ->name('submissions.reject');
    Route::post('submissions/{submission}/assign', [AdminSubmissionController::class, 'assignToUser'])
        ->name('submissions.assign');
    Route::post('submissions/{submission}/mark-under-review', [AdminSubmissionController::class, 'markUnderReview'])
        ->name('submissions.mark-under-review');
});

// Public discipleship form routes (no authentication required)
Route::prefix('public')->name('public.')->group(function () {
    Route::get('discipleship/access', [App\Http\Controllers\PublicDiscipleshipController::class, 'showTokenAccess'])
        ->name('discipleship.access');
    Route::post('discipleship/verify-token', [App\Http\Controllers\PublicDiscipleshipController::class, 'verifyToken'])
        ->name('discipleship.verify-token');
    Route::get('discipleship/create/{token}', [App\Http\Controllers\PublicDiscipleshipController::class, 'create'])
        ->name('discipleship.create');
    Route::post('discipleship/store/{token}', [App\Http\Controllers\PublicDiscipleshipController::class, 'store'])
        ->name('discipleship.store');
    Route::get('discipleship/thanks', [App\Http\Controllers\PublicDiscipleshipController::class, 'thanks'])
        ->name('discipleship.thanks');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
