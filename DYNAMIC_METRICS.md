# Dynamic Metrics Implementation

## Overview
The UI has been updated to handle evaluation metrics dynamically. Instead of hardcoding specific metric fields like `outputScore`, `ragRelevancyScore`, etc., the system now automatically detects and displays any numeric score metrics present in the `ExecutionData`.

## Key Changes

### 1. New Utility Module (`src/utils/metricUtils.js`)
Created a comprehensive utility module with functions for:

- **`isNumericScore(value)`**: Determines if a value is a numeric score
- **`isScoreField(fieldName)`**: Identifies if a field name indicates it's a score metric (contains keywords like "score", "rate", "accuracy", etc.)
- **`isReasonField(fieldName)`**: Identifies explanation/reason fields
- **`extractMetrics(executionData)`**: Extracts and categorizes all metrics from execution data into scores, reasons, and text fields
- **`formatFieldName(fieldName)`**: Converts camelCase/snake_case field names to human-readable titles
- **`getScoreColor(score)`**: Returns color for score visualization (handles both 0-1 and 0-10 scales)
- **`calculateAggregateScores(questions)`**: Calculates average scores across multiple questions
- **`getUniqueScoreFields(runs)`**: Extracts all unique score field types from a dataset
- **`formatNumber(value, decimals)`**: Formats numeric values for display

### 2. Updated Components

#### **RunDetails.jsx**
- ✅ Summary stats cards now dynamically render all available metrics
- ✅ Table headers dynamically generated based on available score fields
- ✅ Table cells render scores with color coding for any numeric metric
- ✅ Sort dropdown options generated dynamically from available metrics
- ✅ Uses `useMemo` for performance optimization

#### **Comparison.jsx**
- ✅ Extracts metrics dynamically using `extractMetrics()`
- ✅ Renders all score fields with their corresponding reason fields
- ✅ Displays scores with color-coded boxes
- ✅ Shows expandable content for long text fields
- ✅ Automatically pairs scores with their explanation fields

#### **QuestionComparison.jsx**
- ✅ Version selection cards show dynamic mini-scores (up to 4 metrics)
- ✅ Score comparison section renders all available metrics with delta calculations
- ✅ CSV export includes all dynamic metric columns
- ✅ JSON export includes all metrics in structured format
- ✅ Average score calculation uses all available metrics

#### **RunsOverview.jsx**
- ✅ Run cards display all available metrics dynamically
- ✅ Aggregate scores calculated for any metric type
- ✅ Overall grade calculation uses average of all available scores
- ✅ Sort dropdown includes all available metrics
- ✅ Score visualization with color coding

### 3. How It Works

#### Metric Detection
The system automatically detects score fields by:
1. Checking if the field name contains keywords: `score`, `rate`, `rating`, `accuracy`, `precision`, `recall`, `f1`, `metric`
2. Verifying the value is numeric (number type and not NaN)
3. Extracting from `ExecutionData` object in each run

#### Display Logic
- **Numeric scores (0-1 or 0-10)**: Rendered as color-coded boxes
- **Reason/explanation fields**: Displayed as expandable text
- **Other text fields**: Shown with expand option if long

#### Color Coding
Scores are automatically color-coded on a gradient:
- **0.9-1.0**: Dark Green (#059669)
- **0.8-0.9**: Green (#10b981)
- **0.7-0.8**: Light Green (#34d399)
- **0.6-0.7**: Yellow (#fbbf24)
- **0.5-0.6**: Orange (#f59e0b)
- **0.4-0.5**: Dark Orange (#f97316)
- **0.3-0.4**: Red (#ef4444)
- **< 0.3**: Dark Red (#dc2626)

### 4. Benefits

1. **Flexibility**: Add new evaluation metrics without code changes
2. **Consistency**: All metrics displayed uniformly across the UI
3. **Maintainability**: Single source of truth for metric handling
4. **Scalability**: Works with any number of metrics
5. **User Experience**: Automatic field name formatting and color coding

### 5. Examples

#### Adding a New Metric
To add a new evaluation metric, simply include it in the database with a descriptive field name:

```javascript
{
  ExecutionData: {
    accuracyScore: 0.87,           // ✅ Automatically detected
    accuracyScoreReason: "...",    // ✅ Paired with score
    coherenceRating: 0.92,         // ✅ Automatically detected
    coherenceRatingReason: "...",  // ✅ Paired with rating
    customMetric: 0.78,            // ✅ Automatically detected
    customMetricExplanation: "..." // ✅ Detected as explanation
  }
}
```

The UI will automatically:
- Display the new metrics in all views
- Add them to sort/filter options
- Include them in exports
- Calculate aggregates
- Apply color coding

#### Field Name Formatting
Field names are automatically formatted:
- `outputScore` → "Output Score"
- `ragRelevancyScore` → "RAG Relevancy Score"
- `hallucinationRate` → "Hallucination Rate"
- `llmAccuracy` → "LLM Accuracy"
- `custom_eval_metric` → "Custom Eval Metric"

### 6. Backward Compatibility

The system is fully backward compatible with existing hardcoded metrics:
- `outputScore`, `ragRelevancyScore`, `hallucinationRate`, `systemPromptAlignmentScore`

These continue to work exactly as before, but are now handled dynamically.

### 7. Performance Considerations

- Uses `useMemo` to cache expensive calculations
- Metric detection happens once per data load
- Minimal overhead for dynamic field access

## Testing Recommendations

1. Test with different metric combinations
2. Verify color coding across all score ranges
3. Check sorting and filtering with dynamic fields
4. Test CSV/JSON exports with various metrics
5. Verify UI responsiveness with many metrics (10+)
6. Test with missing or null metric values

## Future Enhancements

Potential improvements:
1. Custom color scales per metric type
2. Metric grouping/categorization in UI
3. User-configurable metric display order
4. Metric thresholds configuration
5. Chart/graph visualizations for metric trends
6. Metric comparison across different runs
