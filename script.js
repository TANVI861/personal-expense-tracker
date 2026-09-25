$(document).ready(function () {

    // Get expenses from LocalStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Set today's date
    $("#expenseDate").val(
        new Date().toISOString().split("T")[0]
    );

    // Display expenses when page loads
    displayExpenses();

    // Add Expense
    $("#expenseForm").submit(function (event) {
        event.preventDefault();

        const expense = {
            id: Date.now(),
            name: $("#expenseName").val().trim(),
            amount: Number($("#expenseAmount").val()),
            category: $("#expenseCategory").val(),
            date: $("#expenseDate").val()
        };

        expenses.push(expense);

        saveExpenses();

        // Reset form
        $("#expenseForm")[0].reset();

        // Set today's date again
        $("#expenseDate").val(
            new Date().toISOString().split("T")[0]
        );

        displayExpenses();
    });

    // Category Filter
    $("#filterCategory").change(function () {
        displayExpenses();
    });

    // Search Expense
    $("#searchExpense").on("keyup", function () {
        displayExpenses();
    });

    // Clear Filters
    $("#clearFilters").click(function () {
        $("#filterCategory").val("All");
        $("#searchExpense").val("");
        displayExpenses();
    });

    // Delete Expense
    $(document).on("click", ".delete-btn", function () {

        const id = Number($(this).data("id"));

        expenses = expenses.filter(function (expense) {
            return expense.id !== id;
        });

        saveExpenses();
        displayExpenses();
    });

    // Save expenses to LocalStorage
    function saveExpenses() {
        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );
    }

    // Display Expenses
    function displayExpenses() {

        const category = $("#filterCategory").val();
        const search = $("#searchExpense").val().toLowerCase();

        let filteredExpenses = expenses.filter(function (expense) {

            const categoryMatch =
                category === "All" ||
                expense.category === category;

            const searchMatch =
                expense.name.toLowerCase().includes(search);

            return categoryMatch && searchMatch;
        });

        $("#expenseTable").empty();

        if (filteredExpenses.length === 0) {

            $("#noExpense").show();

        } else {

            $("#noExpense").hide();

            filteredExpenses.forEach(function (expense, index) {

                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${expense.name}</td>
                        <td>₹${expense.amount}</td>
                        <td>
                            <span class="badge bg-primary">
                                ${expense.category}
                            </span>
                        </td>
                        <td>${expense.date}</td>
                        <td>
                            <button
                                class="btn btn-danger btn-sm delete-btn"
                                data-id="${expense.id}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

                $("#expenseTable").append(row);
            });
        }

        updateSummary(filteredExpenses);
    }

    // Update Summary Cards
    function updateSummary(data) {

        const total = data.reduce(
            function (sum, expense) {
                return sum + expense.amount;
            },
            0
        );

        const count = data.length;

        const average = count > 0
            ? total / count
            : 0;

        $("#totalAmount").text(
            "₹" + total.toFixed(2)
        );

        $("#totalTransactions").text(count);

        $("#averageAmount").text(
            "₹" + average.toFixed(2)
        );
    }

});