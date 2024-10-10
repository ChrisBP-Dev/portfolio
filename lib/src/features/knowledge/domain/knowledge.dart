class Knowledge {
  const Knowledge({required this.tecnologies});

  final List<Tecnology> tecnologies;
}

class Tecnology {
  const Tecnology({
    required this.name,
    required this.imageUrl,
    // required this.description,
    // required this.experienceTime,
  });

  final String name;
  final String imageUrl;
  // final String description;
  // final double experienceTime;
}
