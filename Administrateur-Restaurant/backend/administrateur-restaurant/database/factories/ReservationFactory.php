<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'   => $this->faker->name(),
            'email'  => $this->faker->optional()->safeEmail(),
            'phone'  => $this->faker->optional()->phoneNumber(),
            'date'   => $this->faker->date('Y-m-d', '+1 year'), 
            'time'   => $this->faker->time('H:i'),
            'guests' => $this->faker->numberBetween(1, 6),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'notes'  => $this->faker->optional()->sentence(),
        ];
    }
}