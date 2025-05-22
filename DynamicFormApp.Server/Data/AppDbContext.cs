using DynamicFormApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DynamicFormApp.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Form> Forms { get; set; }
    public DbSet<FormField> FormFields { get; set; }
    public DbSet<FieldOption> FieldOptions { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<FormResponse> FormResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Form>().Property(e => e.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<FormField>().Property(e => e.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<FieldOption>().Property(e => e.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<User>().Property(e => e.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<Role>().Property(e => e.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<FormResponse>().Property(r => r.Id).UseIdentityAlwaysColumn();
        modelBuilder.Entity<Form>()
            .HasIndex(f => f.PublicId)
            .IsUnique();
    }


    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        var currentUser = 1;

        foreach (var entry in entries)
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedDate = DateTime.UtcNow;
                entry.Entity.CreatedBy = currentUser;
                entry.Entity.Active = true;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.ModifiedDate = DateTime.UtcNow;
                entry.Entity.ModifiedBy = currentUser;
            }

        return base.SaveChangesAsync(cancellationToken);
    }
}