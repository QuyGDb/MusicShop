using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicShop.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameOrderFieldsToMatchERD : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionId",
                table: "Payments",
                newName: "TransactionCode");

            migrationBuilder.RenameColumn(
                name: "Gateway",
                table: "Payments",
                newName: "Method");

            migrationBuilder.RenameColumn(
                name: "ShippingPhone",
                table: "Orders",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "ShippingName",
                table: "Orders",
                newName: "RecipientName");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Orders",
                newName: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionCode",
                table: "Payments",
                newName: "TransactionId");

            migrationBuilder.RenameColumn(
                name: "Method",
                table: "Payments",
                newName: "Gateway");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Orders",
                newName: "CustomerId");

            migrationBuilder.RenameColumn(
                name: "RecipientName",
                table: "Orders",
                newName: "ShippingName");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Orders",
                newName: "ShippingPhone");
        }
    }
}
