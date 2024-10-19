import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/wrap_network_image.dart';

class ProjectImageCard extends StatelessWidget {
  const ProjectImageCard({required this.imageUrl, super.key});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return WrapNetworkImage(
      imageUrl: imageUrl,
    );
  }
}
