using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicShop.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProductVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Add new columns to Products
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSigned",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Products",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "StockQty",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ReleaseVersions",
                type: "text",
                nullable: false,
                defaultValue: "");

            // 2. Data Migration: Move data from ProductVariants to Products
            migrationBuilder.Sql(@"
                UPDATE ""Products"" 
                SET ""Price"" = pv.""Price"", 
                    ""StockQty"" = pv.""StockQty"", 
                    ""IsAvailable"" = pv.""IsAvailable"", 
                    ""IsSigned"" = pv.""IsSigned""
                FROM ""ProductVariants"" pv
                WHERE ""Products"".""Id"" = pv.""ProductId"";
            ");

            // 3. Rename columns and update FK data in related tables
            // CartItems
            migrationBuilder.DropForeignKey(name: "FK_CartItems_ProductVariants_VariantId", table: "CartItems");
            migrationBuilder.RenameColumn(name: "VariantId", table: "CartItems", newName: "ProductId");
            migrationBuilder.Sql(@"
                UPDATE ""CartItems"" 
                SET ""ProductId"" = pv.""ProductId""
                FROM ""ProductVariants"" pv
                WHERE ""CartItems"".""ProductId"" = pv.""Id"";
            ");

            // OrderItems
            migrationBuilder.DropForeignKey(name: "FK_OrderItems_ProductVariants_VariantId", table: "OrderItems");
            migrationBuilder.RenameColumn(name: "VariantId", table: "OrderItems", newName: "ProductId");
            migrationBuilder.Sql(@"
                UPDATE ""OrderItems"" 
                SET ""ProductId"" = pv.""ProductId""
                FROM ""ProductVariants"" pv
                WHERE ""OrderItems"".""ProductId"" = pv.""Id"";
            ");

            // Attributes
            migrationBuilder.DropForeignKey(name: "FK_vinyl_attributes_ProductVariants_ProductVariantId", table: "vinyl_attributes");
            migrationBuilder.RenameColumn(name: "ProductVariantId", table: "vinyl_attributes", newName: "ProductId");
            migrationBuilder.Sql(@"
                UPDATE ""vinyl_attributes"" 
                SET ""ProductId"" = pv.""ProductId""
                FROM ""ProductVariants"" pv
                WHERE ""vinyl_attributes"".""ProductId"" = pv.""Id"";
            ");

            migrationBuilder.DropForeignKey(name: "FK_cd_attributes_ProductVariants_ProductVariantId", table: "cd_attributes");
            migrationBuilder.RenameColumn(name: "ProductVariantId", table: "cd_attributes", newName: "ProductId");
            migrationBuilder.Sql(@"
                UPDATE ""cd_attributes"" 
                SET ""ProductId"" = pv.""ProductId""
                FROM ""ProductVariants"" pv
                WHERE ""cd_attributes"".""ProductId"" = pv.""Id"";
            ");

            migrationBuilder.DropForeignKey(name: "FK_cassette_attributes_ProductVariants_ProductVariantId", table: "cassette_attributes");
            migrationBuilder.RenameColumn(name: "ProductVariantId", table: "cassette_attributes", newName: "ProductId");
            migrationBuilder.Sql(@"
                UPDATE ""cassette_attributes"" 
                SET ""ProductId"" = pv.""ProductId""
                FROM ""ProductVariants"" pv
                WHERE ""cassette_attributes"".""ProductId"" = pv.""Id"";
            ");

            // 4. Drop indices and columns no longer needed
            migrationBuilder.DropColumn(name: "Type", table: "Releases");

            // Rename Indices
            migrationBuilder.RenameIndex(name: "IX_vinyl_attributes_ProductVariantId", table: "vinyl_attributes", newName: "IX_vinyl_attributes_ProductId");
            migrationBuilder.RenameIndex(name: "IX_OrderItems_VariantId", table: "OrderItems", newName: "IX_OrderItems_ProductId");
            migrationBuilder.RenameIndex(name: "IX_cd_attributes_ProductVariantId", table: "cd_attributes", newName: "IX_cd_attributes_ProductId");
            migrationBuilder.RenameIndex(name: "IX_cassette_attributes_ProductVariantId", table: "cassette_attributes", newName: "IX_cassette_attributes_ProductId");
            migrationBuilder.RenameIndex(name: "IX_CartItems_VariantId", table: "CartItems", newName: "IX_CartItems_ProductId");

            // 5. Add new Foreign Keys
            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Products_ProductId",
                table: "CartItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cassette_attributes_Products_ProductId",
                table: "cassette_attributes",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cd_attributes_Products_ProductId",
                table: "cd_attributes",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_vinyl_attributes_Products_ProductId",
                table: "vinyl_attributes",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            // 6. Finally drop the table
            migrationBuilder.DropTable(name: "ProductVariants");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Products_ProductId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_cassette_attributes_Products_ProductId",
                table: "cassette_attributes");

            migrationBuilder.DropForeignKey(
                name: "FK_cd_attributes_Products_ProductId",
                table: "cd_attributes");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_vinyl_attributes_Products_ProductId",
                table: "vinyl_attributes");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ReleaseVersions");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsSigned",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockQty",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "vinyl_attributes",
                newName: "ProductVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_vinyl_attributes_ProductId",
                table: "vinyl_attributes",
                newName: "IX_vinyl_attributes_ProductVariantId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "OrderItems",
                newName: "VariantId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                newName: "IX_OrderItems_VariantId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "cd_attributes",
                newName: "ProductVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_cd_attributes_ProductId",
                table: "cd_attributes",
                newName: "IX_cd_attributes_ProductVariantId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "cassette_attributes",
                newName: "ProductVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_cassette_attributes_ProductId",
                table: "cassette_attributes",
                newName: "IX_cassette_attributes_ProductVariantId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "CartItems",
                newName: "VariantId");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                newName: "IX_CartItems_VariantId");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Releases",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductVariants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false),
                    IsSigned = table.Column<bool>(type: "boolean", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    StockQty = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VariantName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVariants_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_ProductId",
                table: "ProductVariants",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_ProductVariants_VariantId",
                table: "CartItems",
                column: "VariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cassette_attributes_ProductVariants_ProductVariantId",
                table: "cassette_attributes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cd_attributes_ProductVariants_ProductVariantId",
                table: "cd_attributes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_ProductVariants_VariantId",
                table: "OrderItems",
                column: "VariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_vinyl_attributes_ProductVariants_ProductVariantId",
                table: "vinyl_attributes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
