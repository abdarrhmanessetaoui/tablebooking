<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'restaurants' => [
                [
                    'id' => 1,
                    'name' => 'Le Gourmet',
                    'location' => '123 Main St, Cityville',
                    'cuisine' => 'French',
                    'capacity' => 50,
                ],
                [
                    'id' => 2,
                    'name' => 'Sushi World',
                    'location' => '456 Elm St, Townsville',
                    'cuisine' => 'Japanese',
                    'capacity' => 40,
                ],
                [
                    'id' => 3,
                    'name' => 'Pasta Palace',
                    'location' => '789 Oak St, Villagetown',
                    'cuisine' => 'Italian',
                    'capacity' => 60,
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
