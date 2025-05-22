using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DynamicFormApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class PublicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_FormResponses_Forms_FormId",
            //    table: "FormResponses");

            //migrationBuilder.DropIndex(
            //    name: "IX_FormResponses_FormId",
            //    table: "FormResponses");

            //migrationBuilder.AddColumn<string>(
            //    name: "PublicId",
            //    table: "Forms",
            //    type: "text",
            //    nullable: false,
            //    defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "PublicId",
            //    table: "Forms");

            //migrationBuilder.CreateIndex(
            //    name: "IX_FormResponses_FormId",
            //    table: "FormResponses",
            //    column: "FormId");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_FormResponses_Forms_FormId",
            //    table: "FormResponses",
            //    column: "FormId",
            //    principalTable: "Forms",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);
        }
    }
}
