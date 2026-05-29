package com.investwise.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "calculator_goals")
public class CalculatorGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Double initialInvestment;
    private Double monthlyContribution;
    private Double annualInterestRate;
    private Integer years;
    private Double projectedValue;

    public CalculatorGoal() {}

    public CalculatorGoal(String title, Double initialInvestment, Double monthlyContribution, Double annualInterestRate, Integer years, Double projectedValue) {
        this.title = title;
        this.initialInvestment = initialInvestment;
        this.monthlyContribution = monthlyContribution;
        this.annualInterestRate = annualInterestRate;
        this.years = years;
        this.projectedValue = projectedValue;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getInitialInvestment() {
        return initialInvestment;
    }

    public void setInitialInvestment(Double initialInvestment) {
        this.initialInvestment = initialInvestment;
    }

    public Double getMonthlyContribution() {
        return monthlyContribution;
    }

    public void setMonthlyContribution(Double monthlyContribution) {
        this.monthlyContribution = monthlyContribution;
    }

    public Double getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(Double annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public Integer getYears() {
        return years;
    }

    public void setYears(Integer years) {
        this.years = years;
    }

    public Double getProjectedValue() {
        return projectedValue;
    }

    public void setProjectedValue(Double projectedValue) {
        this.projectedValue = projectedValue;
    }
}
