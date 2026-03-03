<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('data/restaurants.json'));
        $restaurants = json_decode($json);
    
        foreach ($restaurants as $restaurant) {
            Restaurant::create([
                'name' => $restaurant->name,
                'city' => $restaurant->city,
                'slug' => strtolower(str_replace(' ', '-', $restaurant->name)),
                'address' => $restaurant->address ?? null,
                'phone' => $restaurant->phone ?? null,
                'capacity' => $restaurant->capacity ?? 0,
            ]);
        }
    
    }
}
