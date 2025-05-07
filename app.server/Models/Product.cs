﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace app.server.Models;

public partial class Product
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Product name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = null!;

    [Range(0.01, 100000, ErrorMessage = "Price must be between 0.01 and 100000")]
    public decimal Price { get; set; }

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
