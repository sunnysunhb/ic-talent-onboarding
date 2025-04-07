﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace app.server.Models;

public partial class Sale
{
    public int Id { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Invalid Product ID")]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Invalid Customer ID")] 
    public int CustomerId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Invalid Store ID")]
    public int StoreId { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime DateSold { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
