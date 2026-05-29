package com.investwise.backend.repository;

import com.investwise.backend.model.CalculatorGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculatorGoalRepository extends JpaRepository<CalculatorGoal, Long> {
}
