package com.investwise.backend.controller;

import com.investwise.backend.model.CalculatorGoal;
import com.investwise.backend.repository.CalculatorGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculators")
@CrossOrigin(origins = "http://localhost:5173")
public class CalculatorController {

    @Autowired
    private CalculatorGoalRepository goalRepository;

    @GetMapping
    public List<CalculatorGoal> getAllGoals() {
        return goalRepository.findAll();
    }

    @PostMapping
    public CalculatorGoal saveGoal(@RequestBody CalculatorGoal goal) {
        return goalRepository.save(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goalRepository.delete(goal);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
