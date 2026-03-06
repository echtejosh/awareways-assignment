<?php

declare(strict_types=1);

use App\Http\Controllers\Api\EventIngestionController;
use App\Http\Controllers\Api\UserCreationController;
use App\Http\Controllers\Api\UserDirectoryController;
use App\Http\Controllers\Api\UserActivityController;
use Illuminate\Support\Facades\Route;

Route::get('/users', UserDirectoryController::class);
Route::post('/users', UserCreationController::class);
Route::post('/events', EventIngestionController::class);
Route::get('/users/{user_id}/activities', [UserActivityController::class, 'activities']);
Route::get('/users/{user_id}/metrics', [UserActivityController::class, 'metrics']);
