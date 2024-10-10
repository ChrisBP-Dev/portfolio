import 'package:flutter/material.dart';

class ProjectImageCard extends StatelessWidget {
  const ProjectImageCard({required this.imageUrl, super.key});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    // TODO(me): change for CacheNetwotkImage
    // return Image.network(urlImage);
    return Image.asset(
      imageUrl,
      height: double.infinity,
      width: double.infinity,
      fit: BoxFit.cover,
    );
  }
}
