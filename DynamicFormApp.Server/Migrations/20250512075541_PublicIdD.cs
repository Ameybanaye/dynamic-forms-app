using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DynamicFormApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class PublicIdD : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Forms_PublicId",
                table: "Forms",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Forms_PublicId",
                table: "Forms");
        }
    }
}
