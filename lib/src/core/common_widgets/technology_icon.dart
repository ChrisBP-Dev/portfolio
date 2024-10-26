import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:portfolio/src/features/knowledge/domain/technology.dart';

class TechnologyIcon extends StatelessWidget {
  const TechnologyIcon({required this.technology, super.key, this.size});
  final Technology technology;
  final double? size;

  @override
  Widget build(BuildContext context) {
    // TODO(me): check if still using SVG
    return SvgPicture.network(
      technology.imageUrl,
      height: size ?? 42,
      width: size ?? 42,
      placeholderBuilder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
