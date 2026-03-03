<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Restaurant;
use App\Models\Reservation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        // Create super admin user
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
        ]);

        // Create restaurant admins
        $admin1 = User::create([
            'name' => 'Marco Rossi',
            'email' => 'marco@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $admin2 = User::create([
            'name' => 'Marie Dupont',
            'email' => 'marie@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create test clients
        $client1 = User::create([
            'name' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
        ]);

        $client2 = User::create([
            'name' => 'Sophie Martin',
            'email' => 'sophie@example.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
        ]);

        // Create restaurants
        $restaurant1 = Restaurant::create([
            'user_id' => $admin1->id,
            'name' => 'La Bella Italia',
            'city' => 'Paris',
            'slug' => 'la-bella-italia-paris',
            'address' => '123 Rue de Rivoli, Paris',
            'phone' => '+33123456789',
            'email' => 'info@labellaItalia.com',
            'description' => 'Authentic Italian cuisine with traditional recipes',
            'cuisine_type' => 'Italian',
            'capacity' => 50,
            'opening_time' => '11:00',
            'closing_time' => '23:00',
        ]);

        $restaurant2 = Restaurant::create([
            'user_id' => $admin2->id,
            'name' => 'Le Petit Bistrot',
            'city' => 'Lyon',
            'slug' => 'le-petit-bistrot-lyon',
            'address' => '456 Rue Saint-Jean, Lyon',
            'phone' => '+33456789123',
            'email' => 'contact@petitbistrot.com',
            'description' => 'Cozy French bistro with classic dishes',
            'cuisine_type' => 'French',
            'capacity' => 30,
            'opening_time' => '12:00',
            'closing_time' => '22:00',
        ]);

        // Create sample reservations for restaurant 1
        for ($i = 0; $i < 5; $i++) {
            Reservation::create([
                'restaurant_id' => $restaurant1->id,
                'client_name' => 'Jean Dupont',
                'client_phone' => '+33612345678',
                'date' => Carbon::today()->addDays($i),
                'time' => '19:00',
                'guests' => rand(2, 6),
                'status' => ['pending', 'confirmed', 'confirmed'][rand(0, 2)],
            ]);
        }

        // Create sample reservations for restaurant 2
        for ($i = 0; $i < 5; $i++) {
            Reservation::create([
                'restaurant_id' => $restaurant2->id,
                'client_name' => 'Sophie Martin',
                'client_phone' => '+33687654321',
                'date' => Carbon::today()->addDays($i),
                'time' => '20:00',
                'guests' => rand(2, 8),
                'status' => ['pending', 'confirmed', 'cancelled'][rand(0, 2)],
            ]);
        }

        $this->command->info('Test data seeded successfully!');
        $this->command->info('Super Admin: superadmin@example.com / password123');
        $this->command->info('Admin 1: marco@example.com / password123');
        $this->command->info('Admin 2: marie@example.com / password123');
        $this->command->info('Client 1: jean@example.com / password123');
        $this->command->info('Client 2: sophie@example.com / password123');
    }
}
